import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest, { params }: { params: { userId: string } }) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Ensure user can only access their own appointments or staff can access any
    if (user.id !== params.userId && user.role !== "staff" && user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const supabase = createClient()

    const { data: appointments, error } = await supabase
      .from("appointments")
      .select(`
        id,
        date,
        time,
        status,
        notes,
        type,
        doctors (
          first_name,
          last_name,
          specialization
        )
      `)
      .eq("patient_id", params.userId)
      .order("date", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 })
    }

    // Transform the data to match the expected format
    const transformedAppointments =
      appointments?.map((appointment) => ({
        id: appointment.id,
        date: appointment.date,
        time: appointment.time,
        status: appointment.status,
        notes: appointment.notes,
        type: appointment.type || "General Consultation",
        doctorName: appointment.doctors
          ? `Dr. ${appointment.doctors.first_name} ${appointment.doctors.last_name}`
          : "Unknown Doctor",
        specialization: appointment.doctors?.specialization || "General Practice",
      })) || []

    return NextResponse.json({
      appointments: transformedAppointments,
      total: transformedAppointments.length,
    })
  } catch (error) {
    console.error("Error fetching appointments:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
