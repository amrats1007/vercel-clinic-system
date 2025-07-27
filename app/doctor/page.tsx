import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { DoctorDashboard } from "@/components/doctor/doctor-dashboard"

export default async function DoctorPage() {
  const user = await getUser()

  if (!user || user.role !== "doctor") {
    redirect("/login")
  }

  return <DoctorDashboard user={user} />
}
