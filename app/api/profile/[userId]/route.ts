import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const supabase = createClient()
    const { userId } = params

    const { data: profile, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 })
    }

    return NextResponse.json(profile)
  } catch (error) {
    console.error("Error fetching profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const supabase = createClient()
    const { userId } = params
    const body = await request.json()

    const { firstName, lastName, email, phone, dateOfBirth, address, emergencyContact, medicalHistory, allergies } =
      body

    // Validate required fields
    if (!firstName || !lastName || !email) {
      return NextResponse.json({ error: "First name, last name, and email are required" }, { status: 400 })
    }

    // Check if email is already taken by another user
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .neq("id", userId)
      .single()

    if (existingUser) {
      return NextResponse.json({ error: "Email is already taken" }, { status: 400 })
    }

    // Update profile
    const { data: updatedProfile, error } = await supabase
      .from("users")
      .update({
        first_name: firstName,
        last_name: lastName,
        email,
        phone,
        date_of_birth: dateOfBirth,
        address,
        emergency_contact: emergencyContact,
        medical_history: medicalHistory,
        allergies,
        updated_at: new Date().toISOString(),
      })
      .eq("id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating profile:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    // Return the updated profile in the expected format
    const formattedProfile = {
      id: updatedProfile.id,
      firstName: updatedProfile.first_name,
      lastName: updatedProfile.last_name,
      email: updatedProfile.email,
      phone: updatedProfile.phone,
      role: updatedProfile.role,
      dateOfBirth: updatedProfile.date_of_birth,
      address: updatedProfile.address,
      emergencyContact: updatedProfile.emergency_contact,
      medicalHistory: updatedProfile.medical_history,
      allergies: updatedProfile.allergies,
      createdAt: updatedProfile.created_at,
    }

    return NextResponse.json(formattedProfile)
  } catch (error) {
    console.error("Error updating profile:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
