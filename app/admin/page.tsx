import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SuperAdminDashboard } from "@/components/admin/super-admin-dashboard"

export default async function AdminPage() {
  const user = await getUser()

  if (!user || user.role !== "super_admin") {
    redirect("/login")
  }

  return <SuperAdminDashboard user={user} />
}
