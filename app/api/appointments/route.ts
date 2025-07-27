import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { getUser } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const user = await getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { doctorId, date, time, notes } = await request.json()

    if (!doctorId || !date || !time) {
      return NextResponse.json({ error: "Doctor, date, and time are required" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Get the doctor's clinic_id
    const { data: doctor, error: doctorError } = await supabase
      .from("doctors")
      .select("clinic_id")
      .eq("id", doctorId)
      .single()

    if (doctorError || !doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 })
    }

    // Check if slot is available (simplified check)
    const { data: existingAppointment } = await supabase
      .from("appointments")
      .select("id")
      .eq("doctor_id", doctorId)
      .eq("appointment_date", date)
      .eq("appointment_time", time)
      .eq("status", "scheduled")
      .single()

    if (existingAppointment) {
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 })
    }

    // Create appointment
    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        patient_id: user.id,
        doctor_id: doctorId,
        clinic_id: doctor.clinic_id,
        appointment_date: date,
        appointment_time: time,
        notes: notes || null,
        status: "scheduled",
      })
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to create appointment" }, { status: 500 })
    }

    return NextResponse.json({ appointment })
  } catch (error) {
    console.error("Appointment creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
