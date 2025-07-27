import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getSession } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Verify the user is a clinic admin
    const { data: adminUser } = await supabase.from("users").select("role, clinic_id").eq("id", session.userId).single()

    if (!adminUser || adminUser.role !== "clinic_admin") {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 })
    }

    const { firstName, lastName, email, phone, role, department, specialization, licenseNumber, password, clinicId } =
      await request.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !role || !password) {
      return NextResponse.json({ error: "Required fields are missing" }, { status: 400 })
    }

    // Validate role
    if (!["doctor", "secretary", "purchasing"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Ensure the clinic admin can only create staff for their own clinic
    if (clinicId !== adminUser.clinic_id) {
      return NextResponse.json({ error: "Cannot create staff for other clinics" }, { status: 403 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email.toLowerCase()).single()

    if (existingUser) {
      return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create staff user
    const { data: newUser, error } = await supabase
      .from("users")
      .insert({
        email: email.toLowerCase(),
        password_hash: passwordHash,
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        role: role,
        clinic_id: clinicId,
        department: department || null,
        specialization: role === "doctor" ? specialization : null,
        license_number: role === "doctor" ? licenseNumber : null,
        is_active: true,
        must_change_password: true, // Force password change on first login
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create staff member" }, { status: 500 })
    }

    return NextResponse.json({
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        role: newUser.role,
        department: newUser.department,
        specialization: newUser.specialization,
      },
      message: "Staff member created successfully",
    })
  } catch (error) {
    console.error("Staff creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
