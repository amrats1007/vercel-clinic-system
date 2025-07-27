"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BarChart3, Download, TrendingUp, Users, Building2, Calendar } from "lucide-react"

export function SystemReports() {
  const reports = [
    {
      title: "Monthly System Overview",
      description: "Comprehensive system-wide statistics and performance metrics",
      type: "overview",
      lastGenerated: "2024-01-15",
      status: "ready",
    },
    {
      title: "Clinic Performance Report",
      description: "Individual clinic performance and comparison analysis",
      type: "performance",
      lastGenerated: "2024-01-14",
      status: "ready",
    },
    {
      title: "User Activity Report",
      description: "User engagement and system usage statistics",
      type: "activity",
      lastGenerated: "2024-01-13",
      status: "generating",
    },
    {
      title: "Financial Summary",
      description: "Revenue, payments, and financial analytics",
      type: "financial",
      lastGenerated: "2024-01-12",
      status: "ready",
    },
  ]

  const quickStats = [
    { label: "Total Appointments", value: "2,847", change: "+12%", icon: Calendar },
    { label: "Active Clinics", value: "12", change: "+2", icon: Building2 },
    { label: "System Users", value: "1,247", change: "+89", icon: Users },
    { label: "Monthly Revenue", value: "SAR 245K", change: "+15%", icon: TrendingUp },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">System Reports</h2>
        <p className="text-gray-600">Comprehensive analytics and reporting dashboard</p>
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
          <CardDescription>Generate and download system reports</CardDescription>
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
      <Card>
        <CardHeader>
          <CardTitle>System Performance Overview</CardTitle>
          <CardDescription>Real-time system metrics and trends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-600">Interactive charts will be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
