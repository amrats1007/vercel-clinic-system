import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, FileText, BarChart3, UserPlus, LogIn, Shield, Clock } from "lucide-react"
import Link from "next/link"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">MediClinic</h1>
          </div>
          <div className="flex items-center space-x-4">
            <LanguageSwitcher />
            <Link href="/login">
              <Button variant="outline" size="sm">
                <LogIn className="w-4 h-4 mr-2" />
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="secondary" className="mb-4">
            Healthcare Management System
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Medical Clinic
            <span className="text-blue-600"> Management</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Comprehensive healthcare management solution for patients, doctors, and clinic administrators
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                <UserPlus className="w-5 h-5 mr-2" />
                Register as Patient
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <LogIn className="w-5 h-5 mr-2" />
                Staff Login
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Registration Info */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-blue-200">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <UserPlus className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Patient Registration</CardTitle>
                <CardDescription>
                  New patients can create accounts to book appointments and access medical services
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-green-500" />
                    Quick 2-minute registration
                  </li>
                  <li className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2 text-green-500" />
                    Book appointments online
                  </li>
                  <li className="flex items-center">
                    <FileText className="w-4 h-4 mr-2 text-green-500" />
                    Access medical records
                  </li>
                </ul>
                <Link href="/register" className="block mt-4">
                  <Button className="w-full">Create Patient Account</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-gray-200">
              <CardHeader>
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-gray-600" />
                </div>
                <CardTitle className="text-gray-900">Staff Access</CardTitle>
                <CardDescription>Medical staff and administrators access their dashboards here</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                    Doctors & Medical Staff
                  </li>
                  <li className="flex items-center">
                    <BarChart3 className="w-4 h-4 mr-2 text-blue-500" />
                    Clinic Administrators
                  </li>
                  <li className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-blue-500" />
                    System Administrators
                  </li>
                </ul>
                <Link href="/login" className="block mt-4">
                  <Button variant="outline" className="w-full bg-transparent">
                    Staff Login Portal
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">System Features</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools for managing all aspects of clinic operations
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Appointment Management</h3>
              <p className="text-sm text-gray-600">Schedule and manage patient appointments efficiently</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Patient Records</h3>
              <p className="text-sm text-gray-600">Comprehensive patient information and medical history</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Billing & Invoicing</h3>
              <p className="text-sm text-gray-600">Automated billing and invoice generation</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-orange-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Reports & Analytics</h3>
              <p className="text-sm text-gray-600">Detailed reports and business insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">MediClinic Management System</span>
          </div>
          <p className="text-gray-400 text-sm">
            © 2024 MediClinic. All rights reserved. | Comprehensive healthcare management solution
          </p>
        </div>
      </footer>
    </div>
  )
}
