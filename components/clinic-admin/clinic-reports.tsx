"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, Calendar, Users, DollarSign, TrendingUp } from "lucide-react"

interface ClinicReportsProps {
  clinicId: string
}

export function ClinicReports({ clinicId }: ClinicReportsProps) {
  const reports = [
    {
      title: "Monthly Performance Report",
      description: "Comprehensive clinic performance metrics and analytics",
      type: "performance",
      lastGenerated: "2024-01-15",
      status: "ready",
    },
    {
      title: "Staff Activity Report",
      description: "Staff productivity and working hours analysis",
      type: "staff",
      lastGenerated: "2024-01-14",
      status: "ready",
    },
    {
      title: "Patient Satisfaction Survey",
      description: "Patient feedback and satisfaction metrics",
      type: "satisfaction",
      lastGenerated: "2024-01-13",
      status: "generating",
    },
    {
      title: "Financial Summary",
      description: "Revenue, expenses, and profit analysis",
      type: "financial",
      lastGenerated: "2024-01-12",
      status: "ready",
    },
  ]

  const quickStats = [
    { label: "This Month's Appointments", value: "342", change: "+18%", icon: Calendar },
    { label: "Active Patients", value: "1,250", change: "+12%", icon: Users },
    { label: "Monthly Revenue", value: "SAR 45,000", change: "+8%", icon: DollarSign },
    { label: "Patient Satisfaction", value: "4.8/5", change: "+0.2", icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Clinic Reports</h2>
        <p className="text-gray-600">Analytics and reporting for your clinic</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-green-600">{stat.change}</p>
                </div>
                <stat.icon className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reports List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Generate and download clinic reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {reports.map((report, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                  <div>
                    <h3 className="font-medium">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    <p className="text-xs text-gray-500">Last generated: {report.lastGenerated}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Badge variant={report.status === "ready" ? "default" : "secondary"}>{report.status}</Badge>
                  <Button variant="outline" size="sm" disabled={report.status !== "ready"}>
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                  <Button size="sm">Generate</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Placeholder */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Appointments</CardTitle>
            <CardDescription>Appointment trends over the last 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Appointment chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue Analysis</CardTitle>
            <CardDescription>Monthly revenue breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Revenue chart will be displayed here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
