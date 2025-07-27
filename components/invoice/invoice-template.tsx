"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { formatCurrency, type arabicCurrencySymbols } from "@/lib/number-utils"
import { formatDate as formatDateUtil } from "@/lib/date-utils"
import type { Language } from "@/lib/i18n"
import { getTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Calendar, User, MapPin, Phone, Mail, Download, PrinterIcon as Print } from "lucide-react"

export interface InvoiceItem {
  id: string
  description: string
  quantity: number
  unitPrice: number
  total: number
}

export interface InvoiceData {
  invoiceNumber: string
  issueDate: string
  dueDate: string
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"

  // Clinic/Provider Info
  clinicName: string
  clinicAddress: string
  clinicPhone: string
  clinicEmail: string
  clinicLicense?: string
  clinicTaxId?: string

  // Patient/Client Info
  patientName: string
  patientAddress?: string
  patientPhone?: string
  patientEmail?: string
  patientId?: string

  // Appointment Info
  appointmentDate?: string
  appointmentTime?: string
  doctorName?: string

  // Financial Info
  items: InvoiceItem[]
  subtotal: number
  discountRate: number
  discountAmount: number
  taxRate: number
  taxAmount: number
  totalAmount: number

  // Payment Info
  paymentMethod?: string
  paymentDate?: string
  paymentReference?: string

  // Additional Info
  notes?: string
  terms?: string
}

interface InvoiceTemplateProps {
  invoice: InvoiceData
  language: Language
  currencyCode?: keyof typeof arabicCurrencySymbols
  template?: "modern" | "classic" | "minimal"
  onPrint?: () => void
  onDownload?: () => void
  className?: string
}

export function InvoiceTemplate({
  invoice,
  language,
  currencyCode = "USD",
  template = "modern",
  onPrint,
  onDownload,
  className,
}: InvoiceTemplateProps) {
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)
  const isRTL = language === "ar"

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "sent":
        return "bg-blue-100 text-blue-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    const statusMap = {
      draft: language === "ar" ? "مسودة" : "Draft",
      sent: language === "ar" ? "مرسل" : "Sent",
      paid: language === "ar" ? "مدفوع" : "Paid",
      overdue: language === "ar" ? "متأخر" : "Overdue",
      cancelled: language === "ar" ? "ملغي" : "Cancelled",
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  if (template === "modern") {
    return (
      <ModernInvoiceTemplate
        {...{
          invoice,
          language,
          currencyCode,
          onPrint,
          onDownload,
          className,
          t,
          isRTL,
          getStatusColor,
          getStatusText,
        }}
      />
    )
  }

  if (template === "classic") {
    return (
      <ClassicInvoiceTemplate
        {...{
          invoice,
          language,
          currencyCode,
          onPrint,
          onDownload,
          className,
          t,
          isRTL,
          getStatusColor,
          getStatusText,
        }}
      />
    )
  }

  return (
    <MinimalInvoiceTemplate
      {...{ invoice, language, currencyCode, onPrint, onDownload, className, t, isRTL, getStatusColor, getStatusText }}
    />
  )
}

// Modern Template Component
function ModernInvoiceTemplate({
  invoice,
  language,
  currencyCode,
  onPrint,
  onDownload,
  className,
  t,
  isRTL,
  getStatusColor,
  getStatusText,
}: any) {
  return (
    <Card className={cn("max-w-4xl mx-auto", className)} dir={isRTL ? "rtl" : "ltr"}>
      <CardContent className="p-8">
        {/* Header */}
        <div className={cn("flex justify-between items-start mb-8", isRTL && "flex-row-reverse")}>
          <div>
            <h1 className="text-3xl font-bold text-blue-600 mb-2">{language === "ar" ? "فاتورة" : "INVOICE"}</h1>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="font-medium">{language === "ar" ? "رقم الفاتورة:" : "Invoice #"}</span>{" "}
                {invoice.invoiceNumber}
              </div>
              <div>
                <span className="font-medium">{language === "ar" ? "تاريخ الإصدار:" : "Issue Date:"}</span>{" "}
                {formatDateUtil(invoice.issueDate, language)}
              </div>
              <div>
                <span className="font-medium">{language === "ar" ? "تاريخ الاستحقاق:" : "Due Date:"}</span>{" "}
                {formatDateUtil(invoice.dueDate, language)}
              </div>
            </div>
          </div>

          <div className={cn("text-right", isRTL && "text-left")}>
            <Badge className={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>
            <div className="mt-4 space-x-2 rtl:space-x-reverse">
              {onPrint && (
                <Button variant="outline" size="sm" onClick={onPrint}>
                  <Print className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === "ar" ? "طباعة" : "Print"}
                </Button>
              )}
              {onDownload && (
                <Button variant="outline" size="sm" onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === "ar" ? "تحميل" : "Download"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Clinic and Patient Info */}
        <div className={cn("grid md:grid-cols-2 gap-8 mb-8", isRTL && "text-right")}>
          {/* From */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <MapPin className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === "ar" ? "من:" : "From:"}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="font-medium text-gray-900">{invoice.clinicName}</div>
              <div>{invoice.clinicAddress}</div>
              <div className="flex items-center">
                <Phone className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                {invoice.clinicPhone}
              </div>
              <div className="flex items-center">
                <Mail className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                {invoice.clinicEmail}
              </div>
              {invoice.clinicLicense && (
                <div>
                  <span className="font-medium">{language === "ar" ? "رقم الترخيص:" : "License:"}</span>{" "}
                  {invoice.clinicLicense}
                </div>
              )}
              {invoice.clinicTaxId && (
                <div>
                  <span className="font-medium">{language === "ar" ? "الرقم الضريبي:" : "Tax ID:"}</span>{" "}
                  {invoice.clinicTaxId}
                </div>
              )}
            </div>
          </div>

          {/* To */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <User className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === "ar" ? "إلى:" : "To:"}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div className="font-medium text-gray-900">{invoice.patientName}</div>
              {invoice.patientAddress && <div>{invoice.patientAddress}</div>}
              {invoice.patientPhone && (
                <div className="flex items-center">
                  <Phone className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                  {invoice.patientPhone}
                </div>
              )}
              {invoice.patientEmail && (
                <div className="flex items-center">
                  <Mail className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                  {invoice.patientEmail}
                </div>
              )}
              {invoice.patientId && (
                <div>
                  <span className="font-medium">{language === "ar" ? "رقم المريض:" : "Patient ID:"}</span>{" "}
                  {invoice.patientId}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Appointment Info */}
        {(invoice.appointmentDate || invoice.doctorName) && (
          <div className="mb-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Calendar className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === "ar" ? "تفاصيل الموعد:" : "Appointment Details:"}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              {invoice.appointmentDate && (
                <div>
                  <span className="font-medium">{language === "ar" ? "التاريخ:" : "Date:"}</span>{" "}
                  {formatDateUtil(invoice.appointmentDate, language)}
                  {invoice.appointmentTime && ` - ${invoice.appointmentTime}`}
                </div>
              )}
              {invoice.doctorName && (
                <div>
                  <span className="font-medium">{language === "ar" ? "الطبيب:" : "Doctor:"}</span> {invoice.doctorName}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items Table */}
        <div className="mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className={cn("py-3 text-left font-semibold text-gray-900", isRTL && "text-right")}>
                    {language === "ar" ? "الوصف" : "Description"}
                  </th>
                  <th className={cn("py-3 text-center font-semibold text-gray-900", isRTL && "text-right")}>
                    {language === "ar" ? "الكمية" : "Qty"}
                  </th>
                  <th className={cn("py-3 text-right font-semibold text-gray-900", isRTL && "text-left")}>
                    {language === "ar" ? "سعر الوحدة" : "Unit Price"}
                  </th>
                  <th className={cn("py-3 text-right font-semibold text-gray-900", isRTL && "text-left")}>
                    {language === "ar" ? "الإجمالي" : "Total"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {invoice.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className={cn("py-4 text-gray-900", isRTL && "text-right")}>{item.description}</td>
                    <td className={cn("py-4 text-center text-gray-600", isRTL && "text-right")}>
                      {formatNumber(item.quantity, language)}
                    </td>
                    <td className={cn("py-4 text-right text-gray-600", isRTL && "text-left")}>
                      {formatCurrency(item.unitPrice, language, currencyCode)}
                    </td>
                    <td className={cn("py-4 text-right font-medium text-gray-900", isRTL && "text-left")}>
                      {formatCurrency(item.total, language, currencyCode)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Totals */}
        <div className={cn("flex justify-end", isRTL && "justify-start")}>
          <div className="w-80">
            <div className="space-y-2">
              <div className="flex justify-between py-2">
                <span className="text-gray-600">{language === "ar" ? "المجموع الفرعي:" : "Subtotal:"}</span>
                <span className="font-medium">{formatCurrency(invoice.subtotal, language, currencyCode)}</span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600">
                    {language === "ar" ? "الخصم" : "Discount"} ({formatPercentage(invoice.discountRate, language)}):
                  </span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(invoice.discountAmount, language, currencyCode)}
                  </span>
                </div>
              )}

              <div className="flex justify-between py-2">
                <span className="text-gray-600">
                  {language === "ar" ? "الضريبة" : "Tax"} ({formatPercentage(invoice.taxRate, language)}):
                </span>
                <span className="font-medium">{formatCurrency(invoice.taxAmount, language, currencyCode)}</span>
              </div>

              <Separator />

              <div className="flex justify-between py-3">
                <span className="text-lg font-semibold text-gray-900">
                  {language === "ar" ? "الإجمالي:" : "Total:"}
                </span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(invoice.totalAmount, language, currencyCode)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Info */}
        {invoice.paymentMethod && (
          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">
              {language === "ar" ? "معلومات الدفع:" : "Payment Information:"}
            </h3>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="font-medium">{language === "ar" ? "طريقة الدفع:" : "Payment Method:"}</span>{" "}
                {invoice.paymentMethod}
              </div>
              {invoice.paymentDate && (
                <div>
                  <span className="font-medium">{language === "ar" ? "تاريخ الدفع:" : "Payment Date:"}</span>{" "}
                  {formatDateUtil(invoice.paymentDate, language)}
                </div>
              )}
              {invoice.paymentReference && (
                <div>
                  <span className="font-medium">{language === "ar" ? "مرجع الدفع:" : "Reference:"}</span>{" "}
                  {invoice.paymentReference}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Notes and Terms */}
        <div className="mt-8 space-y-4">
          {invoice.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">{language === "ar" ? "ملاحظات:" : "Notes:"}</h3>
              <p className="text-sm text-gray-600">{invoice.notes}</p>
            </div>
          )}

          {invoice.terms && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === "ar" ? "الشروط والأحكام:" : "Terms & Conditions:"}
              </h3>
              <p className="text-sm text-gray-600">{invoice.terms}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
          {language === "ar" ? "شكراً لك على اختيار خدماتنا الطبية" : "Thank you for choosing our medical services"}
        </div>
      </CardContent>
    </Card>
  )
}

// Classic Template Component
function ClassicInvoiceTemplate({
  invoice,
  language,
  currencyCode,
  onPrint,
  onDownload,
  className,
  t,
  isRTL,
  getStatusColor,
  getStatusText,
}: any) {
  return (
    <Card className={cn("max-w-4xl mx-auto border-2", className)} dir={isRTL ? "rtl" : "ltr"}>
      <CardContent className="p-8">
        {/* Header with border */}
        <div className="border-b-4 border-blue-600 pb-6 mb-8">
          <div className={cn("flex justify-between items-center", isRTL && "flex-row-reverse")}>
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{language === "ar" ? "فاتورة" : "INVOICE"}</h1>
              <div className="text-lg font-semibold text-blue-600">#{invoice.invoiceNumber}</div>
            </div>

            <div className={cn("text-right", isRTL && "text-left")}>
              <Badge className={cn("text-lg px-4 py-2", getStatusColor(invoice.status))}>
                {getStatusText(invoice.status)}
              </Badge>
            </div>
          </div>
        </div>

        {/* Company Header */}
        <div className="text-center mb-8 p-6 bg-gray-50 rounded">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{invoice.clinicName}</h2>
          <div className="text-gray-600 space-y-1">
            <div>{invoice.clinicAddress}</div>
            <div>
              {invoice.clinicPhone} • {invoice.clinicEmail}
            </div>
            {invoice.clinicLicense && (
              <div className="text-sm">
                {language === "ar" ? "رقم الترخيص:" : "License No:"} {invoice.clinicLicense}
              </div>
            )}
          </div>
        </div>

        {/* Invoice Details */}
        <div className={cn("grid md:grid-cols-3 gap-6 mb-8", isRTL && "text-right")}>
          <div className="border p-4 rounded">
            <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">
              {language === "ar" ? "تفاصيل الفاتورة" : "INVOICE DETAILS"}
            </h3>
            <div className="text-sm space-y-1">
              <div>
                <strong>{language === "ar" ? "تاريخ الإصدار:" : "Issue Date:"}</strong>{" "}
                {formatDateUtil(invoice.issueDate, language)}
              </div>
              <div>
                <strong>{language === "ar" ? "تاريخ الاستحقاق:" : "Due Date:"}</strong>{" "}
                {formatDateUtil(invoice.dueDate, language)}
              </div>
            </div>
          </div>

          <div className="border p-4 rounded">
            <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">
              {language === "ar" ? "معلومات المريض" : "PATIENT INFO"}
            </h3>
            <div className="text-sm space-y-1">
              <div>
                <strong>{invoice.patientName}</strong>
              </div>
              {invoice.patientPhone && <div>{invoice.patientPhone}</div>}
              {invoice.patientEmail && <div>{invoice.patientEmail}</div>}
              {invoice.patientId && <div>ID: {invoice.patientId}</div>}
            </div>
          </div>

          {(invoice.appointmentDate || invoice.doctorName) && (
            <div className="border p-4 rounded">
              <h3 className="font-bold text-gray-900 mb-2 border-b pb-1">
                {language === "ar" ? "تفاصيل الموعد" : "APPOINTMENT"}
              </h3>
              <div className="text-sm space-y-1">
                {invoice.appointmentDate && (
                  <div>
                    <strong>{language === "ar" ? "التاريخ:" : "Date:"}</strong>{" "}
                    {formatDateUtil(invoice.appointmentDate, language)}
                  </div>
                )}
                {invoice.doctorName && (
                  <div>
                    <strong>{language === "ar" ? "الطبيب:" : "Doctor:"}</strong> {invoice.doctorName}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Items Table with borders */}
        <div className="mb-8 border-2 border-gray-300">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className={cn("py-4 px-4 text-left font-bold border-r", isRTL && "text-right")}>
                  {language === "ar" ? "الوصف" : "DESCRIPTION"}
                </th>
                <th className={cn("py-4 px-4 text-center font-bold border-r", isRTL && "text-right")}>
                  {language === "ar" ? "الكمية" : "QTY"}
                </th>
                <th className={cn("py-4 px-4 text-right font-bold border-r", isRTL && "text-left")}>
                  {language === "ar" ? "سعر الوحدة" : "UNIT PRICE"}
                </th>
                <th className={cn("py-4 px-4 text-right font-bold", isRTL && "text-left")}>
                  {language === "ar" ? "الإجمالي" : "TOTAL"}
                </th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                  <td className={cn("py-4 px-4 border-r", isRTL && "text-right")}>{item.description}</td>
                  <td className={cn("py-4 px-4 text-center border-r", isRTL && "text-right")}>
                    {formatNumber(item.quantity, language)}
                  </td>
                  <td className={cn("py-4 px-4 text-right border-r", isRTL && "text-left")}>
                    {formatCurrency(item.unitPrice, language, currencyCode)}
                  </td>
                  <td className={cn("py-4 px-4 text-right font-semibold", isRTL && "text-left")}>
                    {formatCurrency(item.total, language, currencyCode)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals with border */}
        <div className={cn("flex justify-end", isRTL && "justify-start")}>
          <div className="w-96 border-2 border-gray-300">
            <div className="bg-gray-100 p-4 border-b">
              <h3 className="font-bold text-gray-900">{language === "ar" ? "ملخص الفاتورة" : "INVOICE SUMMARY"}</h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">{language === "ar" ? "المجموع الفرعي:" : "Subtotal:"}</span>
                <span className="font-semibold">{formatCurrency(invoice.subtotal, language, currencyCode)}</span>
              </div>

              {invoice.discountAmount > 0 && (
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium text-red-600">{language === "ar" ? "الخصم:" : "Discount:"}</span>
                  <span className="font-semibold text-red-600">
                    -{formatCurrency(invoice.discountAmount, language, currencyCode)}
                  </span>
                </div>
              )}

              <div className="flex justify-between border-b pb-2">
                <span className="font-medium">{language === "ar" ? "الضريبة:" : "Tax:"}</span>
                <span className="font-semibold">{formatCurrency(invoice.taxAmount, language, currencyCode)}</span>
              </div>

              <div className="flex justify-between text-xl font-bold text-blue-600 pt-2 border-t-2">
                <span>{language === "ar" ? "الإجمالي:" : "TOTAL:"}</span>
                <span>{formatCurrency(invoice.totalAmount, language, currencyCode)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-x-4 rtl:space-x-reverse">
          {onPrint && (
            <Button onClick={onPrint} className="px-8">
              <Print className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === "ar" ? "طباعة" : "Print Invoice"}
            </Button>
          )}
          {onDownload && (
            <Button variant="outline" onClick={onDownload} className="px-8 bg-transparent">
              <Download className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === "ar" ? "تحميل PDF" : "Download PDF"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Minimal Template Component
function MinimalInvoiceTemplate({
  invoice,
  language,
  currencyCode,
  onPrint,
  onDownload,
  className,
  t,
  isRTL,
  getStatusColor,
  getStatusText,
}: any) {
  return (
    <Card className={cn("max-w-4xl mx-auto shadow-none border-0", className)} dir={isRTL ? "rtl" : "ltr"}>
      <CardContent className="p-8">
        {/* Simple Header */}
        <div className={cn("flex justify-between items-start mb-12", isRTL && "flex-row-reverse")}>
          <div>
            <h1 className="text-2xl font-light text-gray-900 mb-4">{language === "ar" ? "فاتورة" : "Invoice"}</h1>
            <div className="text-sm text-gray-500 space-y-1">
              <div>#{invoice.invoiceNumber}</div>
              <div>{formatDateUtil(invoice.issueDate, language)}</div>
            </div>
          </div>

          <Badge variant="outline" className={getStatusColor(invoice.status)}>
            {getStatusText(invoice.status)}
          </Badge>
        </div>

        {/* Minimal Info */}
        <div className={cn("grid md:grid-cols-2 gap-12 mb-12", isRTL && "text-right")}>
          <div>
            <div className="text-sm text-gray-500 mb-2">{language === "ar" ? "من" : "From"}</div>
            <div className="space-y-1">
              <div className="font-medium">{invoice.clinicName}</div>
              <div className="text-sm text-gray-600">{invoice.clinicAddress}</div>
              <div className="text-sm text-gray-600">{invoice.clinicEmail}</div>
            </div>
          </div>

          <div>
            <div className="text-sm text-gray-500 mb-2">{language === "ar" ? "إلى" : "To"}</div>
            <div className="space-y-1">
              <div className="font-medium">{invoice.patientName}</div>
              {invoice.patientEmail && <div className="text-sm text-gray-600">{invoice.patientEmail}</div>}
              {invoice.patientPhone && <div className="text-sm text-gray-600">{invoice.patientPhone}</div>}
            </div>
          </div>
        </div>

        {/* Clean Items List */}
        <div className="mb-12">
          {invoice.items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "flex justify-between items-center py-4 border-b border-gray-100",
                isRTL && "flex-row-reverse",
              )}
            >
              <div className="flex-1">
                <div className="font-medium text-gray-900">{item.description}</div>
                <div className="text-sm text-gray-500">
                  {formatNumber(item.quantity, language)} × {formatCurrency(item.unitPrice, language, currencyCode)}
                </div>
              </div>
              <div className="font-medium text-gray-900">{formatCurrency(item.total, language, currencyCode)}</div>
            </div>
          ))}
        </div>

        {/* Simple Totals */}
        <div className={cn("flex justify-end", isRTL && "justify-start")}>
          <div className="w-64 space-y-2">
            {invoice.discountAmount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">{language === "ar" ? "خصم" : "Discount"}</span>
                <span className="text-red-600">-{formatCurrency(invoice.discountAmount, language, currencyCode)}</span>
              </div>
            )}

            <div className="flex justify-between text-sm">
              <span className="text-gray-500">{language === "ar" ? "ضريبة" : "Tax"}</span>
              <span>{formatCurrency(invoice.taxAmount, language, currencyCode)}</span>
            </div>

            <div className="flex justify-between text-lg font-medium pt-2 border-t">
              <span>{language === "ar" ? "الإجمالي" : "Total"}</span>
              <span>{formatCurrency(invoice.totalAmount, language, currencyCode)}</span>
            </div>
          </div>
        </div>

        {/* Minimal Actions */}
        {(onPrint || onDownload) && (
          <div className="mt-12 text-center">
            <div className="inline-flex space-x-2 rtl:space-x-reverse">
              {onPrint && (
                <Button variant="ghost" size="sm" onClick={onPrint}>
                  <Print className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === "ar" ? "طباعة" : "Print"}
                </Button>
              )}
              {onDownload && (
                <Button variant="ghost" size="sm" onClick={onDownload}>
                  <Download className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {language === "ar" ? "تحميل" : "Download"}
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Helper function imports
function formatNumber(num: number, language: Language): string {
  // Import from number-utils
  return num.toString() // Simplified for this example
}

function formatPercentage(num: number, language: Language): string {
  // Import from number-utils
  return `${num}%` // Simplified for this example
}
