"use client"

import { useState } from "react"
import type { User } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, LogOut, Settings, DollarSign } from "lucide-react"
import { AppointmentManagement } from "./appointment-management"
import { PatientManagement } from "./patient-management"
import { ScheduleManagement } from "./schedule-management"
import { StatisticsCard } from "@/components/ui/statistics-card"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { useRouter } from "next/navigation"
import { formatTime } from "@/lib/utils" // Import formatTime
import { PriceDisplay } from "@/components/ui/price-display" // Import PriceDisplay

interface StaffDashboardProps {
  user: User
}

export function StaffDashboard({ user }: StaffDashboardProps) {
  const { language } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">MediBook</h1>
              <p className="text-sm text-gray-600">{t("staffPortal")}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-right rtl:text-left">
              <p className="font-medium">
                Dr. {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-600">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="appointments">{t("appointments")}</TabsTrigger>
            <TabsTrigger value="patients">{t("patients")}</TabsTrigger>
            <TabsTrigger value="schedule">{t("schedule")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <StatisticsCard
                title={t("todaysAppointments")}
                value={8}
                type="number"
                language={language}
                previousValue={6}
                icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
              />

              <StatisticsCard
                title={t("totalPatients")}
                value={247}
                type="number"
                language={language}
                previousValue={235}
                icon={<Users className="h-4 w-4 text-muted-foreground" />}
              />

              <StatisticsCard
                title={t("revenue")}
                value={12500}
                type="currency"
                language={language}
                currencyCode="USD"
                previousValue={11200}
                icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
              />

              <StatisticsCard
                title={t("thisWeek")}
                value={42}
                type="number"
                language={language}
                previousValue={38}
                icon={<Settings className="h-4 w-4 text-muted-foreground" />}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("todaysSchedule")}</CardTitle>
                  <CardDescription>{t("todaysScheduleDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { time: "09:00", patient: "John Smith", type: "Consultation", fee: 150 },
                      { time: "09:30", patient: "Mary Johnson", type: "Follow-up", fee: 100 },
                      { time: "10:00", patient: "Robert Brown", type: "Check-up", fee: 120 },
                      { time: "10:30", patient: "Lisa Davis", type: "Consultation", fee: 150 },
                    ].map((appointment, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium">{appointment.patient}</p>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                        </div>
                        <div className="text-right rtl:text-left">
                          <div className="text-sm font-medium">{formatTime(appointment.time, language)}</div>
                          <PriceDisplay price={appointment.fee} language={language} currencyCode="USD" size="sm" />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("recentActivity")}</CardTitle>
                  <CardDescription>{t("recentActivityDesc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "New appointment booked", patient: "Sarah Wilson", time: "2 hours ago", amount: 200 },
                      { action: "Payment received", patient: "Mike Taylor", time: "4 hours ago", amount: 150 },
                      { action: "Appointment completed", patient: "Emma Davis", time: "1 day ago", amount: 180 },
                      { action: "New patient registered", patient: "Tom Anderson", time: "2 days ago", amount: 0 },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-3 rtl:space-x-reverse">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-sm text-gray-600">{activity.patient}</p>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">{activity.time}</p>
                            {activity.amount > 0 && (
                              <PriceDisplay price={activity.amount} language={language} currencyCode="USD" size="sm" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="appointments">
            <AppointmentManagement />
          </TabsContent>

          <TabsContent value="patients">
            <PatientManagement />
          </TabsContent>

          <TabsContent value="schedule">
            <ScheduleManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
