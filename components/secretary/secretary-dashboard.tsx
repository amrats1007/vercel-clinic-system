"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Phone, UserPlus, Clock } from "lucide-react"
import type { User } from "@/lib/auth"

interface SecretaryDashboardProps {
  user: User
}

export function SecretaryDashboard({ user }: SecretaryDashboardProps) {
  const [activeTab, setActiveTab] = useState("reception")

  const stats = [
    {
      title: "Today's Appointments",
      value: "24",
      description: "Total scheduled",
      icon: Calendar,
      trend: "18 confirmed",
    },
    {
      title: "Waiting Patients",
      value: "3",
      description: "Currently waiting",
      icon: Users,
      trend: "Average wait: 15 min",
    },
    {
      title: "Phone Calls",
      value: "12",
      description: "Calls today",
      icon: Phone,
      trend: "8 appointments booked",
    },
  ]

  const waitingQueue = [
    {
      id: "1",
      patient: "Abdullah Al-Saud",
      doctor: "Dr. Omar Al-Mansouri",
      appointmentTime: "09:00",
      arrivalTime: "08:55",
      waitTime: "15 min",
      status: "waiting",
    },
    {
      id: "2",
      patient: "Noura Al-Fahd",
      doctor: "Dr. Sara Al-Khalil",
      appointmentTime: "09:30",
      arrivalTime: "09:25",
      waitTime: "10 min",
      status: "waiting",
    },
    {
      id: "3",
      patient: "Mohammed Al-Rashid",
      doctor: "Dr. Omar Al-Mansouri",
      appointmentTime: "10:00",
      arrivalTime: "09:45",
      waitTime: "30 min",
      status: "ready",
    },
  ]

  const todayAppointments = [
    {
      id: "1",
      time: "09:00",
      patient: "Abdullah Al-Saud",
      doctor: "Dr. Omar Al-Mansouri",
      type: "Consultation",
      status: "in-progress",
      phone: "+966-50-999-9999",
    },
    {
      id: "2",
      time: "09:30",
      patient: "Noura Al-Fahd",
      doctor: "Dr. Sara Al-Khalil",
      type: "Follow-up",
      status: "waiting",
      phone: "+966-50-000-1111",
    },
    {
      id: "3",
      time: "10:00",
      patient: "Mohammed Al-Rashid",
      doctor: "Dr. Omar Al-Mansouri",
      type: "Check-up",
      status: "scheduled",
      phone: "+966-50-111-2222",
    },
    {
      id: "4",
      time: "10:30",
      patient: "Sara Al-Khalil",
      doctor: "Dr. Sara Al-Khalil",
      type: "Consultation",
      status: "scheduled",
      phone: "+966-50-222-3333",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "waiting":
        return "bg-yellow-100 text-yellow-800"
      case "ready":
        return "bg-green-100 text-green-800"
      case "scheduled":
        return "bg-gray-100 text-gray-800"
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
              <h1 className="text-2xl font-bold text-gray-900">Reception Dashboard</h1>
              <p className="text-gray-600">
                Welcome back, {user.firstName} {user.lastName}
              </p>
              <p className="text-sm text-gray-500">{user.clinicName}</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Secretary
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
            <TabsTrigger value="reception">Reception</TabsTrigger>
            <TabsTrigger value="appointments">Appointments</TabsTrigger>
            <TabsTrigger value="patients">Patients</TabsTrigger>
            <TabsTrigger value="calls">Phone Calls</TabsTrigger>
          </TabsList>

          <TabsContent value="reception" className="space-y-6">
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

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Common reception tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <UserPlus className="h-6 w-6 mb-2" />
                    New Patient
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Calendar className="h-6 w-6 mb-2" />
                    Book Appointment
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Phone className="h-6 w-6 mb-2" />
                    Make Call
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Clock className="h-6 w-6 mb-2" />
                    Check-in Patient
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Waiting Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Waiting Queue</CardTitle>
                <CardDescription>Patients currently waiting</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {waitingQueue.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-bold text-lg">{patient.appointmentTime}</div>
                          <div className="text-sm text-gray-600">Arrived: {patient.arrivalTime}</div>
                        </div>
                        <div>
                          <h3 className="font-medium">{patient.patient}</h3>
                          <p className="text-sm text-gray-600">{patient.doctor}</p>
                          <p className="text-xs text-gray-500">Waiting: {patient.waitTime}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(patient.status)}>{patient.status}</Badge>
                        <div className="flex space-x-2">
                          {patient.status === "ready" && <Button size="sm">Call Patient</Button>}
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Today's Appointments</CardTitle>
                <CardDescription>All appointments scheduled for today</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="text-center">
                          <div className="font-bold text-lg">{appointment.time}</div>
                          <div className="text-sm text-gray-600">{appointment.type}</div>
                        </div>
                        <div>
                          <h3 className="font-medium">{appointment.patient}</h3>
                          <p className="text-sm text-gray-600">{appointment.doctor}</p>
                          <p className="text-xs text-gray-500">{appointment.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge className={getStatusColor(appointment.status)}>
                          {appointment.status.replace("-", " ")}
                        </Badge>
                        <div className="flex space-x-2">
                          {appointment.status === "scheduled" && <Button size="sm">Check-in</Button>}
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4" />
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
                <CardTitle>Patient Management</CardTitle>
                <CardDescription>Register and manage patient information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Patient management interface will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calls">
            <Card>
              <CardHeader>
                <CardTitle>Phone Call Log</CardTitle>
                <CardDescription>Track and manage phone calls</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Phone className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">Phone call management interface will be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
