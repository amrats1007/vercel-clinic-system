"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Clock, FileText, Settings } from "lucide-react"
import type { User } from "@/lib/auth"

interface DoctorDashboardProps {
  user: User
}

export function DoctorDashboard({ user }: DoctorDashboardProps) {
  const [activeTab, setActiveTab] = useState("appointments")

  const stats = [
    {
      title: "Today's Appointments",
      value: "8",
      description: "Scheduled for today",
      icon: Calendar,
      trend: "2 completed",
    },
    {
      title: "Total Patients",
      value: "156",
      description: "Under your care",
      icon: Users,
      trend: "+5 this week",
    },
    {
      title: "Available Hours",
      value: "6h",
      description: "Remaining today",
      icon: Clock,
      trend: "2 slots open",
    },
  ]

  const todayAppointments = [
    {
      id: "1",
      time: "09:00",
      patient: "Abdullah Al-Saud",
      type: "Consultation",
      status: "completed",
      duration: "30 min",
    },
    {
      id: "2",
      time: "09:30",
      patient: "Noura Al-Fahd",
      type: "Follow-up",
      status: "completed",
      duration: "30 min",
    },
    {
      id: "3",
      time: "10:00",
      patient: "Mohammed Al-Rashid",
      type: "Consultation",
      status: "in-progress",
      duration: "30 min",
    },
    {
      id: "4",
      time: "10:30",
      patient: "Sara Al-Khalil",
      type: "Check-up",
      status: "scheduled",
      duration: "30 min",
    },
    {
      id: "5",
      time: "11:00",
      patient: "Ahmed Al-Mansouri",
      type: "Consultation",
      status: "scheduled",
      duration: "30 min",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Doctor Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, Dr. {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500">{user.clinicName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Doctor
              </Badge>
              <Button
                onClick={() =>
                  fetch("/api/auth/logout", { method: "POST" }).then(() => (window.location.href = "/login"))
                }
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {stats.map((stat, index) => (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                    <stat.icon className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">{stat.description}</p>
                    <p className="text-xs text-green-600 mt-1">{stat.trend}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Today's Appointments */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>Your schedule for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-bold text-lg">{appointment.time}</div>
                          <div className="text-sm text-gray-600">{appointment.duration}</div>
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.patient}</h3>
                          <p className="text-sm text-gray-600">{appointment.type}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.replace("-", " ")}
                        </Badge>
                        <div className="flex space-x-2">
                          {appointment.status === "scheduled" && <Button size="sm">Start</Button>}
                          {appointment.status === "in-progress" && (
                            <Button size="sm" variant="outline">
                              Complete
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="patients">
            <Card>
              <CardHeader>
                <CardTitle>My Patients</CardTitle>
                <CardDescription>Patients under your care</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Patient management interface will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>My Schedule</CardTitle>
                <CardDescription>Manage your availability and working hours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Schedule management interface will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Doctor Profile</CardTitle>
                <CardDescription>Manage your professional information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Profile management interface will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
