import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ClinicAdminDashboard } from "@/components/clinic-admin/clinic-admin-dashboard"

export default async function ClinicAdminPage() {
  const user = await getUser()

  if (!user || user.role !== "clinic_admin") {
    redirect("/login")
  }

  return <ClinicAdminDashboard user={user} />
}
