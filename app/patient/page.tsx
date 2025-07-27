import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { PatientDashboard } from "@/components/patient/patient-dashboard"

export default async function PatientPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role !== "patient") {
    redirect("/staff")
  }

  return <PatientDashboard user={user} />
}
