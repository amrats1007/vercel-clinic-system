"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, type arabicCurrencySymbols } from "@/lib/number-utils"
import { formatDate } from "@/lib/date-utils"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { Search, Plus, Eye, Edit, Send, Download, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Invoice {
  id: string
  invoiceNumber: string
  patientName: string
  issueDate: string
  dueDate: string
  totalAmount: number
  status: "draft" | "sent" | "paid" | "overdue" | "cancelled"
  currencyCode: keyof typeof arabicCurrencySymbols
}

interface InvoiceListProps {
  onCreateNew?: () => void
  onView?: (invoice: Invoice) => void
  onEdit?: (invoice: Invoice) => void
  onSend?: (invoice: Invoice) => void
  onDownload?: (invoice: Invoice) => void
}

export function InvoiceList({ onCreateNew, onView, onEdit, onSend, onDownload }: InvoiceListProps) {
  const { language } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)
  const isRTL = language === "ar"

  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isLoading, setIsLoading] = useState(true)

  // Mock data
  useEffect(() => {
    const mockInvoices: Invoice[] = [
      {
        id: "1",
        invoiceNumber: "INV-2024-001",
        patientName: "أحمد محمد علي",
        issueDate: "2024-01-15",
        dueDate: "2024-02-14",
        totalAmount: 575,
        status: "paid",
        currencyCode: "SAR",
      },
      {
        id: "2",
        invoiceNumber: "INV-2024-002",
        patientName: "Sarah Johnson",
        issueDate: "2024-01-16",
        dueDate: "2024-02-15",
        totalAmount: 320,
        status: "sent",
        currencyCode: "USD",
      },
      {
        id: "3",
        invoiceNumber: "INV-2024-003",
        patientName: "فاطمة أحمد",
        issueDate: "2024-01-17",
        dueDate: "2024-02-16",
        totalAmount: 450,
        status: "overdue",
        currencyCode: "AED",
      },
      {
        id: "4",
        invoiceNumber: "INV-2024-004",
        patientName: "Michael Brown",
        issueDate: "2024-01-18",
        dueDate: "2024-02-17",
        totalAmount: 280,
        status: "draft",
        currencyCode: "USD",
      },
      {
        id: "5",
        invoiceNumber: "INV-2024-005",
        patientName: "عبدالله الخالد",
        issueDate: "2024-01-19",
        dueDate: "2024-02-18",
        totalAmount: 650,
        status: "sent",
        currencyCode: "SAR",
      },
    ]

    setInvoices(mockInvoices)
    setFilteredInvoices(mockInvoices)
    setIsLoading(false)
  }, [])

  // Filter invoices
  useEffect(() => {
    let filtered = invoices

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (invoice) =>
          invoice.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((invoice) => invoice.status === statusFilter)
    }

    setFilteredInvoices(filtered)
  }, [invoices, searchTerm, statusFilter])

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

  if (isLoading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card dir={isRTL ? "rtl" : "ltr"}>
      <CardHeader>
        <div className={cn("flex items-center justify-between", isRTL && "flex-row-reverse")}>
          <div>
            <CardTitle>{language === "ar" ? "الفواتير" : "Invoices"}</CardTitle>
            <CardDescription>
              {language === "ar" ? "إدارة وتتبع جميع الفواتير" : "Manage and track all invoices"}
            </CardDescription>
          </div>
          {onCreateNew && (
            <Button onClick={onCreateNew}>
              <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {language === "ar" ? "فاتورة جديدة" : "New Invoice"}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 rtl:left-auto rtl:right-3" />
              <Input
                placeholder={
                  language === "ar" ? "البحث بالاسم أو رقم الفاتورة..." : "Search by name or invoice number..."
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={cn("pl-10", isRTL && "pr-10 pl-3")}
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder={language === "ar" ? "تصفية حسب الحالة" : "Filter by status"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{language === "ar" ? "جميع الحالات" : "All Status"}</SelectItem>
              <SelectItem value="draft">{language === "ar" ? "مسودة" : "Draft"}</SelectItem>
              <SelectItem value="sent">{language === "ar" ? "مرسل" : "Sent"}</SelectItem>
              <SelectItem value="paid">{language === "ar" ? "مدفوع" : "Paid"}</SelectItem>
              <SelectItem value="overdue">{language === "ar" ? "متأخر" : "Overdue"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Invoices Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={cn("text-left", isRTL && "text-right")}>
                  {language === "ar" ? "رقم الفاتورة" : "Invoice #"}
                </TableHead>
                <TableHead className={cn("text-left", isRTL && "text-right")}>
                  {language === "ar" ? "المريض" : "Patient"}
                </TableHead>
                <TableHead className={cn("text-left", isRTL && "text-right")}>
                  {language === "ar" ? "تاريخ الإصدار" : "Issue Date"}
                </TableHead>
                <TableHead className={cn("text-left", isRTL && "text-right")}>
                  {language === "ar" ? "تاريخ الاستحقاق" : "Due Date"}
                </TableHead>
                <TableHead className={cn("text-right", isRTL && "text-left")}>
                  {language === "ar" ? "المبلغ" : "Amount"}
                </TableHead>
                <TableHead className={cn("text-center", isRTL && "text-center")}>
                  {language === "ar" ? "الحالة" : "Status"}
                </TableHead>
                <TableHead className={cn("text-right", isRTL && "text-left")}>
                  {language === "ar" ? "الإجراءات" : "Actions"}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className={cn("font-medium", isRTL && "text-right")}>{invoice.invoiceNumber}</TableCell>
                  <TableCell className={cn("", isRTL && "text-right")}>{invoice.patientName}</TableCell>
                  <TableCell className={cn("", isRTL && "text-right")}>
                    {formatDate(invoice.issueDate, language)}
                  </TableCell>
                  <TableCell className={cn("", isRTL && "text-right")}>
                    {formatDate(invoice.dueDate, language)}
                  </TableCell>
                  <TableCell className={cn("text-right font-medium", isRTL && "text-left")}>
                    {formatCurrency(invoice.totalAmount, language, invoice.currencyCode)}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge className={getStatusColor(invoice.status)}>{getStatusText(invoice.status)}</Badge>
                  </TableCell>
                  <TableCell className={cn("text-right", isRTL && "text-left")}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align={isRTL ? "start" : "end"}>
                        {onView && (
                          <DropdownMenuItem onClick={() => onView(invoice)}>
                            <Eye className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            {language === "ar" ? "عرض" : "View"}
                          </DropdownMenuItem>
                        )}
                        {onEdit && invoice.status === "draft" && (
                          <DropdownMenuItem onClick={() => onEdit(invoice)}>
                            <Edit className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            {language === "ar" ? "تعديل" : "Edit"}
                          </DropdownMenuItem>
                        )}
                        {onSend && (invoice.status === "draft" || invoice.status === "sent") && (
                          <DropdownMenuItem onClick={() => onSend(invoice)}>
                            <Send className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            {language === "ar" ? "إرسال" : "Send"}
                          </DropdownMenuItem>
                        )}
                        {onDownload && (
                          <DropdownMenuItem onClick={() => onDownload(invoice)}>
                            <Download className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                            {language === "ar" ? "تحميل PDF" : "Download PDF"}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredInvoices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {language === "ar"
              ? "لم يتم العثور على فواتير تطابق معايير البحث."
              : "No invoices found matching your criteria."}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
