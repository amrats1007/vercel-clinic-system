"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CurrencyInput } from "@/components/ui/currency-input"
import { PercentageInput } from "@/components/ui/percentage-input"
import { DatePicker } from "@/components/ui/date-picker"
import { Separator } from "@/components/ui/separator"
import { InvoiceTemplate, type InvoiceData, type InvoiceItem } from "./invoice-template"
import { type arabicCurrencySymbols, formatCurrency } from "@/lib/number-utils"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { Plus, Trash2, FileText, Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface InvoiceGeneratorProps {
  patientData?: {
    name: string
    email?: string
    phone?: string
    address?: string
    id?: string
  }
  appointmentData?: {
    date: string
    time: string
    doctorName: string
  }
  onSave?: (invoice: InvoiceData) => void
  onSend?: (invoice: InvoiceData) => void
}

export function InvoiceGenerator({ patientData, appointmentData, onSave, onSend }: InvoiceGeneratorProps) {
  const { language } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)
  const isRTL = language === "ar"

  const [showPreview, setShowPreview] = useState(false)
  const [template, setTemplate] = useState<"modern" | "classic" | "minimal">("modern")
  const [currencyCode, setCurrencyCode] = useState<keyof typeof arabicCurrencySymbols>("USD")

  // Invoice form state
  const [invoiceData, setInvoiceData] = useState<Partial<InvoiceData>>({
    invoiceNumber: `INV-${Date.now()}`,
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    status: "draft",

    // Clinic info (would come from settings)
    clinicName: "Central Medical Clinic",
    clinicAddress: "123 Main St, City, State 12345",
    clinicPhone: "+1234567890",
    clinicEmail: "info@centralmedical.com",
    clinicLicense: "MD-12345",
    clinicTaxId: "TAX-67890",

    // Patient info
    patientName: patientData?.name || "",
    patientEmail: patientData?.email || "",
    patientPhone: patientData?.phone || "",
    patientAddress: patientData?.address || "",
    patientId: patientData?.id || "",

    // Appointment info
    appointmentDate: appointmentData?.date || "",
    appointmentTime: appointmentData?.time || "",
    doctorName: appointmentData?.doctorName || "",

    // Financial info
    items: [
      {
        id: "1",
        description: language === "ar" ? "استشارة طبية" : "Medical Consultation",
        quantity: 1,
        unitPrice: 150,
        total: 150,
      },
    ],
    subtotal: 150,
    discountRate: 0,
    discountAmount: 0,
    taxRate: 15,
    taxAmount: 22.5,
    totalAmount: 172.5,

    notes:
      language === "ar"
        ? "شكراً لك على زيارتك. نتمنى لك الصحة والعافية."
        : "Thank you for your visit. We wish you good health.",
    terms:
      language === "ar"
        ? "الدفع مستحق خلال 30 يوماً من تاريخ الفاتورة. رسوم إضافية قد تطبق على المدفوعات المتأخرة."
        : "Payment is due within 30 days of invoice date. Late fees may apply to overdue payments.",
  })

  // Update totals when items or rates change
  const updateTotals = (items: InvoiceItem[], discountRate: number, taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0)
    const discountAmount = subtotal * (discountRate / 100)
    const discountedAmount = subtotal - discountAmount
    const taxAmount = discountedAmount * (taxRate / 100)
    const totalAmount = discountedAmount + taxAmount

    setInvoiceData((prev) => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      totalAmount,
    }))
  }

  // Add new item
  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: "",
      quantity: 1,
      unitPrice: 0,
      total: 0,
    }

    const newItems = [...(invoiceData.items || []), newItem]
    setInvoiceData((prev) => ({ ...prev, items: newItems }))
    updateTotals(newItems, invoiceData.discountRate || 0, invoiceData.taxRate || 0)
  }

  // Remove item
  const removeItem = (id: string) => {
    const newItems = (invoiceData.items || []).filter((item) => item.id !== id)
    setInvoiceData((prev) => ({ ...prev, items: newItems }))
    updateTotals(newItems, invoiceData.discountRate || 0, invoiceData.taxRate || 0)
  }

  // Update item
  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    const newItems = (invoiceData.items || []).map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }
        if (field === "quantity" || field === "unitPrice") {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice
        }
        return updatedItem
      }
      return item
    })

    setInvoiceData((prev) => ({ ...prev, items: newItems }))
    updateTotals(newItems, invoiceData.discountRate || 0, invoiceData.taxRate || 0)
  }

  // Handle discount/tax rate changes
  const handleRateChange = (field: "discountRate" | "taxRate", value: number) => {
    setInvoiceData((prev) => ({ ...prev, [field]: value }))
    updateTotals(
      invoiceData.items || [],
      field === "discountRate" ? value : invoiceData.discountRate || 0,
      field === "taxRate" ? value : invoiceData.taxRate || 0,
    )
  }

  const handleSave = () => {
    if (onSave && invoiceData) {
      onSave(invoiceData as InvoiceData)
    }
  }

  const handleSend = () => {
    if (onSend && invoiceData) {
      const updatedInvoice = { ...invoiceData, status: "sent" as const }
      setInvoiceData(updatedInvoice)
      onSend(updatedInvoice as InvoiceData)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // Implementation for PDF download would go here
    console.log("Download PDF")
  }

  if (showPreview && invoiceData) {
    return (
      <div className="space-y-4">
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <Button variant="outline" onClick={() => setShowPreview(false)}>
            {language === "ar" ? "العودة للتحرير" : "Back to Edit"}
          </Button>

          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Select value={template} onValueChange={(value: any) => setTemplate(value)}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="modern">{language === "ar" ? "حديث" : "Modern"}</SelectItem>
                <SelectItem value="classic">{language === "ar" ? "كلاسيكي" : "Classic"}</SelectItem>
                <SelectItem value="minimal">{language === "ar" ? "بسيط" : "Minimal"}</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={handleSave} variant="outline">
              {language === "ar" ? "حفظ" : "Save"}
            </Button>

            <Button onClick={handleSend}>{language === "ar" ? "إرسال" : "Send"}</Button>
          </div>
        </div>

        <InvoiceTemplate
          invoice={invoiceData as InvoiceData}
          language={language}
          currencyCode={currencyCode}
          template={template}
          onPrint={handlePrint}
          onDownload={handleDownload}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <Card>
        <CardHeader>
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <div>
              <CardTitle className="flex items-center">
                <FileText className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                {language === "ar" ? "إنشاء فاتورة" : "Create Invoice"}
              </CardTitle>
              <CardDescription>
                {language === "ar" ? "أنشئ فاتورة احترافية للمريض" : "Generate a professional invoice for the patient"}
              </CardDescription>
            </div>

            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <Select value={currencyCode} onValueChange={(value: any) => setCurrencyCode(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="SAR">SAR</SelectItem>
                  <SelectItem value="AED">AED</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" onClick={() => setShowPreview(true)}>
                <Eye className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                {language === "ar" ? "معاينة" : "Preview"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Invoice Details */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === "ar" ? "تفاصيل الفاتورة" : "Invoice Details"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === "ar" ? "رقم الفاتورة" : "Invoice Number"}</Label>
                <Input
                  value={invoiceData.invoiceNumber || ""}
                  onChange={(e) => setInvoiceData((prev) => ({ ...prev, invoiceNumber: e.target.value }))}
                />
              </div>
              <div>
                <Label>{language === "ar" ? "الحالة" : "Status"}</Label>
                <Select
                  value={invoiceData.status}
                  onValueChange={(value: any) => setInvoiceData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">{language === "ar" ? "مسودة" : "Draft"}</SelectItem>
                    <SelectItem value="sent">{language === "ar" ? "مرسل" : "Sent"}</SelectItem>
                    <SelectItem value="paid">{language === "ar" ? "مدفوع" : "Paid"}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === "ar" ? "تاريخ الإصدار" : "Issue Date"}</Label>
                <DatePicker
                  date={invoiceData.issueDate ? new Date(invoiceData.issueDate) : undefined}
                  onDateChange={(date) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      issueDate: date?.toISOString().split("T")[0],
                    }))
                  }
                  language={language}
                />
              </div>
              <div>
                <Label>{language === "ar" ? "تاريخ الاستحقاق" : "Due Date"}</Label>
                <DatePicker
                  date={invoiceData.dueDate ? new Date(invoiceData.dueDate) : undefined}
                  onDateChange={(date) =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      dueDate: date?.toISOString().split("T")[0],
                    }))
                  }
                  language={language}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === "ar" ? "معلومات المريض" : "Patient Information"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>{language === "ar" ? "اسم المريض" : "Patient Name"}</Label>
              <Input
                value={invoiceData.patientName || ""}
                onChange={(e) => setInvoiceData((prev) => ({ ...prev, patientName: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                <Input
                  type="email"
                  value={invoiceData.patientEmail || ""}
                  onChange={(e) => setInvoiceData((prev) => ({ ...prev, patientEmail: e.target.value }))}
                />
              </div>
              <div>
                <Label>{language === "ar" ? "الهاتف" : "Phone"}</Label>
                <Input
                  value={invoiceData.patientPhone || ""}
                  onChange={(e) => setInvoiceData((prev) => ({ ...prev, patientPhone: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label>{language === "ar" ? "العنوان" : "Address"}</Label>
              <Textarea
                value={invoiceData.patientAddress || ""}
                onChange={(e) => setInvoiceData((prev) => ({ ...prev, patientAddress: e.target.value }))}
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items */}
      <Card>
        <CardHeader>
          <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
            <CardTitle>{language === "ar" ? "عناصر الفاتورة" : "Invoice Items"}</CardTitle>
            <Button onClick={addItem} size="sm">
              <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === "ar" ? "إضافة عنصر" : "Add Item"}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {invoiceData.items?.map((item) => (
              <div key={item.id} className="grid grid-cols-12 gap-4 items-end">
                <div className="col-span-5">
                  <Label>{language === "ar" ? "الوصف" : "Description"}</Label>
                  <Input
                    value={item.description}
                    onChange={(e) => updateItem(item.id, "description", e.target.value)}
                    placeholder={language === "ar" ? "وصف الخدمة" : "Service description"}
                  />
                </div>

                <div className="col-span-2">
                  <Label>{language === "ar" ? "الكمية" : "Quantity"}</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value))}
                  />
                </div>

                <div className="col-span-2">
                  <CurrencyInput
                    label={language === "ar" ? "سعر الوحدة" : "Unit Price"}
                    value={item.unitPrice}
                    onChange={(value) => updateItem(item.id, "unitPrice", value)}
                    language={language}
                    currencyCode={currencyCode}
                  />
                </div>

                <div className="col-span-2">
                  <Label>{language === "ar" ? "الإجمالي" : "Total"}</Label>
                  <div className="h-10 px-3 py-2 border rounded-md bg-gray-50 flex items-center">
                    {formatCurrency(item.total, language, currencyCode)}
                  </div>
                </div>

                <div className="col-span-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Totals */}
      <Card>
        <CardHeader>
          <CardTitle>{language === "ar" ? "الحسابات" : "Calculations"}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <PercentageInput
                label={language === "ar" ? "معدل الخصم" : "Discount Rate"}
                value={invoiceData.discountRate || 0}
                onChange={(value) => handleRateChange("discountRate", value)}
                language={language}
                max={50}
              />

              <PercentageInput
                label={language === "ar" ? "معدل الضريبة" : "Tax Rate"}
                value={invoiceData.taxRate || 0}
                onChange={(value) => handleRateChange("taxRate", value)}
                language={language}
                required
              />
            </div>

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between">
                <span>{language === "ar" ? "المجموع الفرعي:" : "Subtotal:"}</span>
                <span className="font-medium">{formatCurrency(invoiceData.subtotal || 0, language, currencyCode)}</span>
              </div>

              {(invoiceData.discountAmount || 0) > 0 && (
                <div className="flex justify-between text-red-600">
                  <span>{language === "ar" ? "الخصم:" : "Discount:"}</span>
                  <span>-{formatCurrency(invoiceData.discountAmount || 0, language, currencyCode)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{language === "ar" ? "الضريبة:" : "Tax:"}</span>
                <span>{formatCurrency(invoiceData.taxAmount || 0, language, currencyCode)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-semibold">
                <span>{language === "ar" ? "الإجمالي:" : "Total:"}</span>
                <span className="text-blue-600">
                  {formatCurrency(invoiceData.totalAmount || 0, language, currencyCode)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notes and Terms */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{language === "ar" ? "ملاحظات" : "Notes"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={invoiceData.notes || ""}
              onChange={(e) => setInvoiceData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder={language === "ar" ? "ملاحظات إضافية..." : "Additional notes..."}
              rows={4}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{language === "ar" ? "الشروط والأحكام" : "Terms & Conditions"}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              value={invoiceData.terms || ""}
              onChange={(e) => setInvoiceData((prev) => ({ ...prev, terms: e.target.value }))}
              placeholder={language === "ar" ? "شروط الدفع والأحكام..." : "Payment terms and conditions..."}
              rows={4}
            />
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className={cn("flex justify-end space-x-4 rtl:space-x-reverse", isRTL && "justify-start")}>
        <Button variant="outline" onClick={handleSave}>
          {language === "ar" ? "حفظ كمسودة" : "Save as Draft"}
        </Button>
        <Button onClick={() => setShowPreview(true)}>
          <Eye className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
          {language === "ar" ? "معاينة وإرسال" : "Preview & Send"}
        </Button>
      </div>
    </div>
  )
}
