"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, Users, BarChart3 } from "lucide-react"
import { ClinicManagement } from "./clinic-management"
import { SystemReports } from "./system-reports"
import { SystemSettings } from "./system-settings"
import type { User } from "@/lib/auth"

interface SuperAdminDashboardProps {
  user: User
}

export function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      title: "Total Clinics",
      value: "12",
      description: "Active medical centers",
      icon: Building2,
      trend: "+2 this month",
    },
    {
      title: "Total Users",
      value: "1,247",
      description: "All system users",
      icon: Users,
      trend: "+89 this month",
    },
    {
      title: "Monthly Revenue",
      value: "SAR 245,000",
      description: "System-wide revenue",
      icon: BarChart3,
      trend: "+12% from last month",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
              <p className="text-gray-600">
                Welcome back, {user.firstName} {user.lastName}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                Super Admin
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
            <TabsTrigger value="clinics">Clinics</TabsTrigger>
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

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent System Activity</CardTitle>
                <CardDescription>Latest activities across all clinics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { action: "New clinic registered", clinic: "Al-Noor Medical Center", time: "2 hours ago" },
                    { action: "Staff member added", clinic: "City Medical Center", time: "4 hours ago" },
                    { action: "System backup completed", clinic: "System", time: "6 hours ago" },
                    { action: "Monthly report generated", clinic: "Family Health Clinic", time: "1 day ago" },
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center justify-between py-2 border-b last:border-b-0">
                      <div>
                        <p className="font-medium">{activity.action}</p>
                        <p className="text-sm text-gray-600">{activity.clinic}</p>
                      </div>
                      <span className="text-sm text-gray-500">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clinics">
            <ClinicManagement />
          </TabsContent>

          <TabsContent value="reports">
            <SystemReports />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
