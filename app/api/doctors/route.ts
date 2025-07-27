import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function GET() {
  try {
    const supabase = createServerClient()

    const { data: doctors, error } = await supabase.from("doctors").select(`
        id,
        specialization,
        consultation_fee,
        users!inner(first_name, last_name)
      `)

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch doctors" }, { status: 500 })
    }

    const formattedDoctors = doctors.map((doctor: any) => ({
      id: doctor.id,
      name: `Dr. ${doctor.users.first_name} ${doctor.users.last_name}`,
      specialization: doctor.specialization,
      fee: doctor.consultation_fee,
    }))

    return NextResponse.json({ doctors: formattedDoctors })
  } catch (error) {
    console.error("Error fetching doctors:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
