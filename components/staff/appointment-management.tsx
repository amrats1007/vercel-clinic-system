"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, User, Search, CheckCircle, XCircle, Phone } from "lucide-react"

// Import the correct utilities
import { formatDate, formatTime } from "@/lib/date-utils"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

interface Appointment {
  id: string
  patientName: string
  patientPhone: string
  date: string
  time: string
  type: string
  status: "scheduled" | "completed" | "cancelled" | "no_show"
  notes?: string
}

export function AppointmentManagement() {
  const { language } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [dateFilter, setDateFilter] = useState("today")

  // Mock data
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: "1",
        patientName: "John Smith",
        patientPhone: "+1234567890",
        date: "2024-01-15",
        time: "09:00",
        type: "Consultation",
        status: "scheduled",
        notes: "Regular checkup",
      },
      {
        id: "2",
        patientName: "Mary Johnson",
        patientPhone: "+1234567891",
        date: "2024-01-15",
        time: "09:30",
        type: "Follow-up",
        status: "completed",
        notes: "Blood pressure check",
      },
      {
        id: "3",
        patientName: "Robert Brown",
        patientPhone: "+1234567892",
        date: "2024-01-15",
        time: "10:00",
        type: "Check-up",
        status: "scheduled",
      },
      {
        id: "4",
        patientName: "Lisa Davis",
        patientPhone: "+1234567893",
        date: "2024-01-15",
        time: "10:30",
        type: "Consultation",
        status: "cancelled",
        notes: "Patient requested reschedule",
      },
      {
        id: "5",
        patientName: "Sarah Wilson",
        patientPhone: "+1234567894",
        date: "2024-01-16",
        time: "14:00",
        type: "Follow-up",
        status: "scheduled",
      },
    ]
    setAppointments(mockAppointments)
    setFilteredAppointments(mockAppointments)
  }, [])

  // Filter appointments based on search and filters
  useEffect(() => {
    let filtered = appointments

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (apt) =>
          apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || apt.patientPhone.includes(searchTerm),
      )
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((apt) => apt.status === statusFilter)
    }

    // Date filter
    const today = new Date().toISOString().split("T")[0]
    if (dateFilter === "today") {
      filtered = filtered.filter((apt) => apt.date === today)
    } else if (dateFilter === "upcoming") {
      filtered = filtered.filter((apt) => new Date(apt.date) >= new Date())
    }

    setFilteredAppointments(filtered)
  }, [appointments, searchTerm, statusFilter, dateFilter])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      case "no_show":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const updateAppointmentStatus = (id: string, newStatus: string) => {
    setAppointments((prev) => prev.map((apt) => (apt.id === id ? { ...apt, status: newStatus as any } : apt)))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("appointmentManagement")}</CardTitle>
          <CardDescription>{t("managePatientAppointments")}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 rtl:left-auto rtl:right-3" />
                <Input
                  placeholder={t("searchPatients")}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 rtl:pl-3 rtl:pr-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("filterByStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allStatus")}</SelectItem>
                <SelectItem value="scheduled">{t("scheduled")}</SelectItem>
                <SelectItem value="completed">{t("completed")}</SelectItem>
                <SelectItem value="cancelled">{t("cancelled")}</SelectItem>
                <SelectItem value="no_show">{t("noShow")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder={t("filterByDate")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allDates")}</SelectItem>
                <SelectItem value="today">{t("today")}</SelectItem>
                <SelectItem value="upcoming">{t("upcoming")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Appointments Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("patient")}</TableHead>
                  <TableHead>{t("dateTime")}</TableHead>
                  <TableHead>{t("type")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAppointments.map((appointment) => (
                  <TableRow key={appointment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{appointment.patientName}</div>
                        <div className="text-sm text-gray-600 flex items-center">
                          <Phone className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                          {appointment.patientPhone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Calendar className="w-4 h-4 text-gray-600" />
                        <div>
                          <div className="font-medium">{formatDate(appointment.date, language)}</div>
                          <div className="text-sm text-gray-600 flex items-center">
                            <Clock className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1" />
                            {formatTime(appointment.time, language)}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{appointment.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(appointment.status)}>
                        {t(appointment.status as keyof typeof import("@/lib/i18n").translations.en)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2 rtl:space-x-reverse">
                        {appointment.status === "scheduled" && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, "completed")}
                            >
                              <CheckCircle className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                              {t("complete")}
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateAppointmentStatus(appointment.id, "cancelled")}
                            >
                              <XCircle className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                              {t("cancel")}
                            </Button>
                          </>
                        )}
                        <Button size="sm" variant="ghost">
                          <User className="w-4 h-4 mr-1 rtl:mr-0 rtl:ml-1" />
                          {t("view")}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredAppointments.length === 0 && (
            <div className="text-center py-8 text-gray-500">{t("noAppointmentsFound")}</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
