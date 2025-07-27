import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, dateOfBirth, gender, address, role = "patient" } = body

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ success: false, error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const { data: existingUser } = await supabase.from("users").select("id").eq("email", email).single()

    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Prepare user data - only include fields that exist in the database
    const userData: any = {
      first_name: firstName,
      last_name: lastName,
      email: email.toLowerCase(),
      phone,
      password_hash: hashedPassword,
      role: role,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    // Add optional fields if they exist and have values
    if (dateOfBirth) userData.date_of_birth = dateOfBirth
    if (gender) userData.gender = gender
    if (address) userData.address = address

    // Insert user into database
    const { data: newUser, error: insertError } = await supabase.from("users").insert([userData]).select().single()

    if (insertError) {
      console.error("Database insert error:", insertError)

      // Handle specific database errors
      if (insertError.message.includes("column") && insertError.message.includes("does not exist")) {
        return NextResponse.json(
          {
            success: false,
            error: "Database schema error. Please contact administrator to run database migrations.",
          },
          { status: 500 },
        )
      }

      return NextResponse.json({ success: false, error: "Failed to create user account" }, { status: 500 })
    }

    // Return success response (don't include sensitive data)
    return NextResponse.json({
      success: true,
      message: "User registered successfully",
      user: {
        id: newUser.id,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
        email: newUser.email,
        role: newUser.role,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 })
  }
}
