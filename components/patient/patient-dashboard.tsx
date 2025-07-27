"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, User, Activity, Plus, Eye, LogOut } from "lucide-react"
import { AppointmentBooking } from "./appointment-booking"
import { MyAppointments } from "./my-appointments"
import { ProfileManagement } from "./profile-management"
import { getTranslation } from "@/lib/i18n"
import { useLanguage } from "@/hooks/use-language"
import { useRouter } from "next/navigation"
import type { User as AuthUser } from "@/lib/auth"
import { cn } from "@/lib/utils"

interface PatientDashboardProps {
  user: AuthUser
}

export function PatientDashboard({ user }: PatientDashboardProps) {
  const { language } = useLanguage()
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)
  const isRTL = language === "ar"

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-gray-50" dir={isRTL ? "rtl" : "ltr"}>
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">MediBook</h1>
              <p className="text-sm text-gray-600">{t("patientPortal")}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <div className="text-right rtl:text-left">
              <p className="font-medium">
                {user.firstName} {user.lastName}
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
        {/* Welcome Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t("welcome")}, {user.firstName}!
          </h1>
          <p className="text-gray-600">
            {language === "ar" ? "إدارة مواعيدك ومعلوماتك الصحية" : "Manage your appointments and health information"}
          </p>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className={cn("grid w-full grid-cols-4", isRTL && "flex-row-reverse")}>
            <TabsTrigger value="overview" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Activity className="h-4 w-4" />
              <span>{t("overview")}</span>
            </TabsTrigger>
            <TabsTrigger value="book-appointment" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Plus className="h-4 w-4" />
              <span>{t("bookAppointmentTab")}</span>
            </TabsTrigger>
            <TabsTrigger value="my-appointments" className="flex items-center space-x-2 rtl:space-x-reverse">
              <Calendar className="h-4 w-4" />
              <span>{t("myAppointments")}</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center space-x-2 rtl:space-x-reverse">
              <User className="h-4 w-4" />
              <span>{t("profile")}</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("upcomingAppointments")}</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2</div>
                  <p className="text-xs text-muted-foreground">{t("thisWeek")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("totalVisits")}</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12</div>
                  <p className="text-xs text-muted-foreground">{t("thisYear")}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{t("lastVisit")}</CardTitle>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5</div>
                  <p className="text-xs text-muted-foreground">{t("daysAgo")}</p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>{t("quickActions")}</CardTitle>
                <CardDescription>{t("quickActionsDesc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => setActiveTab("book-appointment")}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Plus className="h-6 w-6" />
                    <span>{t("bookNewAppointment")}</span>
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setActiveTab("my-appointments")}
                    className="h-20 flex flex-col items-center justify-center space-y-2"
                  >
                    <Eye className="h-6 w-6" />
                    <span>{t("viewMyAppointments")}</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>{t("recentAppointments")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-lg",
                      isRTL && "flex-row-reverse",
                    )}
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{t("generalConsultation")}</p>
                        <p className="text-sm text-gray-500">
                          {language === "ar" ? "د. أحمد محمد" : "Dr. Ahmed Mohammed"}
                        </p>
                      </div>
                    </div>
                    <div className={cn("text-right", isRTL && "text-left")}>
                      <p className="text-sm font-medium">{language === "ar" ? "15 يناير 2024" : "Jan 15, 2024"}</p>
                      <Badge variant="secondary">{t("completed")}</Badge>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "flex items-center justify-between p-4 border rounded-lg",
                      isRTL && "flex-row-reverse",
                    )}
                  >
                    <div className="flex items-center space-x-4 rtl:space-x-reverse">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div>
                        <p className="font-medium">{t("followUp")}</p>
                        <p className="text-sm text-gray-500">
                          {language === "ar" ? "د. سارة أحمد" : "Dr. Sarah Ahmed"}
                        </p>
                      </div>
                    </div>
                    <div className={cn("text-right", isRTL && "text-left")}>
                      <p className="text-sm font-medium">{language === "ar" ? "20 يناير 2024" : "Jan 20, 2024"}</p>
                      <Badge>{t("scheduled")}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Book Appointment Tab */}
          <TabsContent value="book-appointment">
            <AppointmentBooking userId={user.id} />
          </TabsContent>

          {/* My Appointments Tab */}
          <TabsContent value="my-appointments">
            <MyAppointments userId={user.id} />
          </TabsContent>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <ProfileManagement user={user} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
