import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { StaffDashboard } from "@/components/staff/staff-dashboard"

export default async function StaffPage() {
  const user = await getUser()

  if (!user) {
    redirect("/login")
  }

  if (user.role === "patient") {
    redirect("/patient")
  }

  return <StaffDashboard user={user} />
}
