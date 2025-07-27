import { redirect } from "next/navigation"
import { getUser } from "@/lib/auth"
import { InvoiceManagement } from "@/components/invoice/invoice-management"

export default async function InvoicesPage() {
  const user = await getUser()

  if (!user || user.role !== "staff") {
    redirect("/login")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <InvoiceManagement user={user} />
    </div>
  )
}
