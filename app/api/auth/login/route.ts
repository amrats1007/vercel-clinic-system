import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { createSession } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get user with clinic information
    const { data: user, error } = await supabase
      .from("users")
      .select(`
        id, 
        email, 
        password_hash, 
        first_name, 
        last_name, 
        role, 
        clinic_id,
        is_active,
        clinics(name)
      `)
      .eq("email", email.toLowerCase())
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Create session
    await createSession(user.id)

    // Determine redirect path based on role
    let redirectPath = "/dashboard"
    switch (user.role) {
      case "super_admin":
        redirectPath = "/admin"
        break
      case "clinic_admin":
        redirectPath = "/clinic-admin"
        break
      case "doctor":
        redirectPath = "/doctor"
        break
      case "secretary":
        redirectPath = "/secretary"
        break
      case "purchasing":
        redirectPath = "/purchasing"
        break
      case "patient":
        redirectPath = "/patient"
        break
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        clinicId: user.clinic_id,
        clinicName: user.clinics?.name,
      },
      redirectPath,
    })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
