import "server-only"
import { cookies } from "next/headers"
import { createServerClient } from "./supabase"

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phone?: string
  role: "super_admin" | "clinic_admin" | "doctor" | "secretary" | "purchasing" | "patient"
  clinicId?: string
  clinicName?: string
  isActive: boolean
  mustChangePassword?: boolean
  permissions?: string[]
}

export interface Clinic {
  id: string
  name: string
  nameAr?: string
  description?: string
  address: string
  city: string
  phone?: string
  email?: string
  licenseNumber?: string
  isActive: boolean
}

export async function getUser(): Promise<User | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get("session")

    if (!sessionCookie) {
      return null
    }

    const supabase = createServerClient()
    const { data: user } = await supabase
      .from("users")
      .select(`
        id, 
        email, 
        first_name, 
        last_name, 
        phone, 
        role, 
        clinic_id,
        is_active,
        must_change_password,
        clinics(name)
      `)
      .eq("id", sessionCookie.value)
      .eq("is_active", true)
      .single()

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name,
      phone: user.phone,
      role: user.role,
      clinicId: user.clinic_id,
      clinicName: user.clinics?.name,
      isActive: user.is_active,
      mustChangePassword: user.must_change_password,
    }
  } catch (error) {
    console.error("Error getting user:", error)
    return null
  }
}

export async function getUserPermissions(userId: string, role: string): Promise<string[]> {
  try {
    const supabase = createServerClient()
    const { data: permissions } = await supabase.from("role_permissions").select("resource, actions").eq("role", role)

    if (!permissions) return []

    const permissionList: string[] = []
    permissions.forEach((perm) => {
      perm.actions.forEach((action: string) => {
        permissionList.push(`${perm.resource}:${action}`)
      })
    })

    return permissionList
  } catch (error) {
    console.error("Error getting permissions:", error)
    return []
  }
}

export async function hasPermission(user: User, resource: string, action: string): Promise<boolean> {
  if (user.role === "super_admin") return true

  const permissions = await getUserPermissions(user.id, user.role)
  return permissions.includes(`${resource}:${action}`)
}

export async function canAccessClinicData(user: User, targetClinicId: string): Promise<boolean> {
  // Super admin can access all clinics
  if (user.role === "super_admin") return true

  // Users can only access data from their own clinic
  return user.clinicId === targetClinicId
}

export async function canAccessPatientData(user: User, patientId: string): Promise<boolean> {
  // Patients can only access their own data
  if (user.role === "patient") {
    return user.id === patientId
  }

  // Staff can access patients from their clinic
  if (["doctor", "secretary", "purchasing", "clinic_admin"].includes(user.role)) {
    const supabase = createServerClient()
    const { data: patient } = await supabase
      .from("users")
      .select("id")
      .eq("id", patientId)
      .eq("role", "patient")
      .single()

    // For patients, we don't restrict by clinic (they can visit any clinic)
    return !!patient
  }

  return false
}

export async function createSession(userId: string) {
  const cookieStore = await cookies()
  cookieStore.set("session", userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("session")
}
