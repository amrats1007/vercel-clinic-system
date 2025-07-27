"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Search, User, Phone, Mail, Calendar, Plus, Eye } from "lucide-react"

interface Patient {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dateOfBirth: string
  lastVisit: string
  totalVisits: number
  status: "active" | "inactive"
}

export function PatientManagement() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [filteredPatients, setFilteredPatients] = useState<Patient[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)

  // Mock data
  useEffect(() => {
    const mockPatients: Patient[] = [
      {
        id: "1",
        firstName: "John",
        lastName: "Smith",
        email: "john.smith@email.com",
        phone: "+1234567890",
        dateOfBirth: "1985-03-15",
        lastVisit: "2024-01-10",
        totalVisits: 12,
        status: "active",
      },
      {
        id: "2",
        firstName: "Mary",
        lastName: "Johnson",
        email: "mary.johnson@email.com",
        phone: "+1234567891",
        dateOfBirth: "1978-07-22",
        lastVisit: "2024-01-08",
        totalVisits: 8,
        status: "active",
      },
      {
        id: "3",
        firstName: "Robert",
        lastName: "Brown",
        email: "robert.brown@email.com",
        phone: "+1234567892",
        dateOfBirth: "1992-11-03",
        lastVisit: "2023-12-15",
        totalVisits: 5,
        status: "inactive",
      },
      {
        id: "4",
        firstName: "Lisa",
        lastName: "Davis",
        email: "lisa.davis@email.com",
        phone: "+1234567893",
        dateOfBirth: "1988-09-18",
        lastVisit: "2024-01-12",
        totalVisits: 15,
        status: "active",
      },
    ]
    setPatients(mockPatients)
    setFilteredPatients(mockPatients)
  }, [])

  // Filter patients based on search
  useEffect(() => {
    if (searchTerm) {
      const filtered = patients.filter(
        (patient) =>
          `${patient.firstName} ${patient.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          patient.phone.includes(searchTerm),
      )
      setFilteredPatients(filtered)
    } else {
      setFilteredPatients(patients)
    }
  }, [patients, searchTerm])

  const calculateAge = (dateOfBirth: string) => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Patient Management</CardTitle>
              <CardDescription>View and manage patient information</CardDescription>
            </div>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Patients Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Last Visit</TableHead>
                  <TableHead>Total Visits</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {patient.firstName} {patient.lastName}
                          </div>
                          <div className="text-sm text-gray-600">ID: {patient.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1 text-gray-600" />
                          {patient.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 text-gray-600" />
                          {patient.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{calculateAge(patient.dateOfBirth)} years</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1 text-gray-600" />
                        {new Date(patient.lastVisit).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">{patient.totalVisits}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          patient.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }
                      >
                        {patient.status.charAt(0).toUpperCase() + patient.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => setSelectedPatient(patient)}>
                            <Eye className="w-4 h-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Patient Details</DialogTitle>
                            <DialogDescription>
                              Complete information for {selectedPatient?.firstName} {selectedPatient?.lastName}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedPatient && (
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <h4 className="font-medium mb-2">Personal Information</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <strong>Name:</strong> {selectedPatient.firstName} {selectedPatient.lastName}
                                    </div>
                                    <div>
                                      <strong>Date of Birth:</strong>{" "}
                                      {new Date(selectedPatient.dateOfBirth).toLocaleDateString()}
                                    </div>
                                    <div>
                                      <strong>Age:</strong> {calculateAge(selectedPatient.dateOfBirth)} years
                                    </div>
                                    <div>
                                      <strong>Email:</strong> {selectedPatient.email}
                                    </div>
                                    <div>
                                      <strong>Phone:</strong> {selectedPatient.phone}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <h4 className="font-medium mb-2">Medical History</h4>
                                  <div className="space-y-2 text-sm">
                                    <div>
                                      <strong>Total Visits:</strong> {selectedPatient.totalVisits}
                                    </div>
                                    <div>
                                      <strong>Last Visit:</strong>{" "}
                                      {new Date(selectedPatient.lastVisit).toLocaleDateString()}
                                    </div>
                                    <div>
                                      <strong>Status:</strong> {selectedPatient.status}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h4 className="font-medium mb-2">Recent Appointments</h4>
                                <div className="space-y-2">
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <div className="flex justify-between items-start">
                                      <div>
                                        <div className="font-medium">General Consultation</div>
                                        <div className="text-sm text-gray-600">January 10, 2024 - 10:00 AM</div>
                                      </div>
                                      <Badge className="bg-green-100 text-green-800">Completed</Badge>
                                    </div>
                                    <div className="text-sm text-gray-600 mt-2">
                                      Regular checkup - all vitals normal
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredPatients.length === 0 && (
            <div className="text-center py-8 text-gray-500">No patients found matching your search criteria.</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
