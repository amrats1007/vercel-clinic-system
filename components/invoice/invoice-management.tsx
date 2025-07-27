"use client"

import { useState } from "react"
import type { User } from "@/lib/auth"
import { InvoiceList } from "./invoice-list"
import { InvoiceGenerator } from "./invoice-generator"
import { InvoiceTemplate, type InvoiceData } from "./invoice-template"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

interface InvoiceManagementProps {
  user: User
}

type ViewMode = "list" | "create" | "edit" | "view"

export function InvoiceManagement({ user }: InvoiceManagementProps) {
  const { language } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  const [viewMode, setViewMode] = useState<ViewMode>("list")
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  const handleCreateNew = () => {
    setSelectedInvoice(null)
    setViewMode("create")
  }

  const handleView = (invoice: any) => {
    setSelectedInvoice(invoice)
    setViewMode("view")
  }

  const handleEdit = (invoice: any) => {
    setSelectedInvoice(invoice)
    setViewMode("edit")
  }

  const handleSave = (invoice: InvoiceData) => {
    console.log("Saving invoice:", invoice)
    // Here you would save to your database
    setViewMode("list")
  }

  const handleSend = (invoice: InvoiceData) => {
    console.log("Sending invoice:", invoice)
    // Here you would send the invoice via email
    setViewMode("list")
  }

  const handleDownload = (invoice: any) => {
    console.log("Downloading invoice:", invoice)
    // Here you would generate and download PDF
  }

  if (viewMode === "create") {
    return <InvoiceGenerator onSave={handleSave} onSend={handleSend} />
  }

  if (viewMode === "edit" && selectedInvoice) {
    return (
      <InvoiceGenerator
        patientData={{
          name: selectedInvoice.patientName,
          email: selectedInvoice.patientEmail,
          phone: selectedInvoice.patientPhone,
        }}
        onSave={handleSave}
        onSend={handleSend}
      />
    )
  }

  if (viewMode === "view" && selectedInvoice) {
    // Convert selected invoice to InvoiceData format
    const invoiceData: InvoiceData = {
      ...selectedInvoice,
      items: [
        {
          id: "1",
          description: language === "ar" ? "استشارة طبية" : "Medical Consultation",
          quantity: 1,
          unitPrice: selectedInvoice.totalAmount,
          total: selectedInvoice.totalAmount,
        },
      ],
      subtotal: selectedInvoice.totalAmount,
      discountRate: 0,
      discountAmount: 0,
      taxRate: 0,
      taxAmount: 0,
      clinicName: "Central Medical Clinic",
      clinicAddress: "123 Main St, City, State 12345",
      clinicPhone: "+1234567890",
      clinicEmail: "info@centralmedical.com",
    }

    return (
      <div className="space-y-4">
        <button onClick={() => setViewMode("list")} className="text-blue-600 hover:text-blue-700 text-sm">
          ← {language === "ar" ? "العودة للقائمة" : "Back to List"}
        </button>

        <InvoiceTemplate
          invoice={invoiceData}
          language={language}
          currencyCode={selectedInvoice.currencyCode}
          onDownload={() => handleDownload(selectedInvoice)}
        />
      </div>
    )
  }

  return (
    <InvoiceList
      onCreateNew={handleCreateNew}
      onView={handleView}
      onEdit={handleEdit}
      onSend={handleSend}
      onDownload={handleDownload}
    />
  )
}
