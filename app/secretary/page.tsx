import { getUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { SecretaryDashboard } from "@/components/secretary/secretary-dashboard"

export default async function SecretaryPage() {
  const user = await getUser()

  if (!user || user.role !== "secretary") {
    redirect("/login")
  }

  return <SecretaryDashboard user={user} />
}
