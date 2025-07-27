"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { formatDate, formatTime } from "@/lib/date-utils"

interface Appointment {
  id: string
  doctorName: string
  specialization: string
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  type: string
}

interface MyAppointmentsProps {
  userId: string
}

export function MyAppointments({ userId }: MyAppointmentsProps) {
  const { language } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/appointments/patient/${userId}`)

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error("You don't have permission to view these appointments")
        }
        throw new Error(`Failed to load appointments: ${response.statusText}`)
      }

      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setError(error instanceof Error ? error.message : "Failed to load appointments")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (userId) {
      fetchAppointments()
    }
  }, [userId])

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === "scheduled" && new Date(apt.date) >= new Date(),
  )

  const pastAppointments = appointments.filter((apt) => apt.status === "completed" || new Date(apt.date) < new Date())

  const getStatusBadge = (status: string) => {
    const statusMap = {
      scheduled: { variant: "default" as const, label: t("scheduled") },
      completed: { variant: "secondary" as const, label: t("completed") },
      cancelled: { variant: "destructive" as const, label: t("cancelled") },
    }

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.scheduled
    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>
  }

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4 rtl:space-x-reverse">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{appointment.doctorName}</h3>
              <p className="text-gray-600 text-sm">{appointment.specialization}</p>
              <p className="text-gray-800 font-medium">{appointment.type}</p>
              {appointment.notes && <p className="text-gray-600 text-sm mt-1">{appointment.notes}</p>}
            </div>
          </div>
          <div className="text-right rtl:text-left">
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{formatDate(appointment.date, language)}</span>
            </div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">{formatTime(appointment.time, language)}</span>
            </div>
            {getStatusBadge(appointment.status)}
          </div>
        </div>
        {appointment.status === "scheduled" && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">
              {t("reschedule")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("myAppointments")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t("loading")}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("myAppointments")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
              <Button
                variant="outline"
                size="sm"
                className="ml-4 rtl:ml-0 rtl:mr-4 bg-transparent"
                onClick={fetchAppointments}
              >
                {t("tryAgain")}
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("myAppointments")}</CardTitle>
          <CardDescription>{t("scheduledAppointments")}</CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="upcoming" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upcoming">
            {t("upcomingAppointments")} ({upcomingAppointments.length})
          </TabsTrigger>
          <TabsTrigger value="past">
            {t("appointmentHistory")} ({pastAppointments.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-4">
          {upcomingAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noUpcomingAppointments")}</h3>
                  <p className="text-gray-600">{t("noUpcomingAppointments")}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            upcomingAppointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          {pastAppointments.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{t("noPastAppointments")}</h3>
                  <p className="text-gray-600">{t("noPastAppointments")}</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            pastAppointments.map((appointment) => <AppointmentCard key={appointment.id} appointment={appointment} />)
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
