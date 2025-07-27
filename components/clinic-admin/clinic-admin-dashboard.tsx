"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, UserPlus, BarChart3, Settings, Calendar } from "lucide-react"
import { StaffManagement } from "./staff-management"
import { ClinicReports } from "./clinic-reports"
import { ClinicSettings } from "./clinic-settings"
import type { User } from "@/lib/auth"

interface ClinicAdminDashboardProps {
  user: User
}

export function ClinicAdminDashboard({ user }: ClinicAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      title: "Total Staff",
      value: "15",
      description: "Active staff members",
      icon: Users,
      trend: "+2 this month",
    },
    {
      title: "Today's Appointments",
      value: "28",
      description: "Scheduled for today",
      icon: Calendar,
      trend: "3 pending",
    },
    {
      title: "Monthly Revenue",
      value: "SAR 45,000",
      description: "This month's earnings",
      icon: BarChart3,
      trend: "+8% from last month",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.clinicName}</h1>
              <p className="text-gray-600">
                Welcome back, Dr. {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Clinic Admin
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
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="staff">Staff Management</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
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
                <CardDescription>Common administrative tasks</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col items-center justify-center">
                    <UserPlus className="h-6 w-6 mb-2" />
                    Add Staff
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Calendar className="h-6 w-6 mb-2" />
                    View Schedule
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <BarChart3 className="h-6 w-6 mb-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col items-center justify-center bg-transparent">
                    <Settings className="h-6 w-6 mb-2" />
                    Clinic Settings
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest activities in your clinic</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New staff member added", user: "Dr. Sara Al-Khalil", time: "2 hours ago" },
                    { action: "Appointment scheduled", user: "Patient: Abdullah Al-Saud", time: "4 hours ago" },
                    { action: "Monthly report generated", user: "System", time: "1 day ago" },
                    { action: "Staff schedule updated", user: "Secretary: Maryam Al-Otaibi", time: "2 days ago" },
                    { action: "Staff schedule updated", user: "Secretary: Maryam Al-Otaibi", time: "2 days ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.user}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff">
            <StaffManagement clinicId={user.clinicId!} />
          </TabsContent>

          <TabsContent value="reports">
            <ClinicReports clinicId={user.clinicId!} />
          </TabsContent>

          <TabsContent value="settings">
            <ClinicSettings clinicId={user.clinicId!} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
