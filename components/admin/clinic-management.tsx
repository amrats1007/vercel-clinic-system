"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Eye, Edit, Trash2, Building2, Users } from "lucide-react"

export function ClinicManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newClinic, setNewClinic] = useState({
    name: "",
    nameAr: "",
    address: "",
    city: "",
    phone: "",
    email: "",
    licenseNumber: "",
  })

  const clinics = [
    {
      id: "1",
      name: "City Medical Center",
      nameAr: "مركز المدينة الطبي",
      city: "Riyadh",
      phone: "+966-11-123-4567",
      email: "info@citymedical.com",
      staff: 15,
      patients: 1250,
      appointments: 89,
      status: "active",
    },
    {
      id: "2",
      name: "Family Health Clinic",
      nameAr: "عيادة صحة الأسرة",
      city: "Jeddah",
      phone: "+966-12-987-6543",
      email: "contact@familyhealth.com",
      staff: 8,
      patients: 650,
      appointments: 45,
      status: "active",
    },
  ]

  const handleCreateClinic = async () => {
    // API call to create clinic
    console.log("Creating clinic:", newClinic)
    setIsCreateDialogOpen(false)
    setNewClinic({
      name: "",
      nameAr: "",
      address: "",
      city: "",
      phone: "",
      email: "",
      licenseNumber: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Clinic Management</h2>
          <p className="text-gray-600">Manage all medical centers in the system</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add New Clinic
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Clinic</DialogTitle>
              <DialogDescription>Add a new medical center to the system</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Clinic Name (English)</Label>
                <Input
                  id="name"
                  value={newClinic.name}
                  onChange={(e) => setNewClinic({ ...newClinic, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameAr">Clinic Name (Arabic)</Label>
                <Input
                  id="nameAr"
                  value={newClinic.nameAr}
                  onChange={(e) => setNewClinic({ ...newClinic, nameAr: e.target.value })}
                  className="text-right"
                  dir="rtl"
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={newClinic.address}
                  onChange={(e) => setNewClinic({ ...newClinic, address: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={newClinic.city}
                  onChange={(e) => setNewClinic({ ...newClinic, city: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={newClinic.phone}
                  onChange={(e) => setNewClinic({ ...newClinic, phone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClinic.email}
                  onChange={(e) => setNewClinic({ ...newClinic, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={newClinic.licenseNumber}
                  onChange={(e) => setNewClinic({ ...newClinic, licenseNumber: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateClinic}>Create Clinic</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Clinics</CardTitle>
          <CardDescription>Overview of all medical centers in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clinic</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Staff</TableHead>
                <TableHead>Patients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clinics.map((clinic) => (
                <TableRow key={clinic.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{clinic.name}</div>
                      <div className="text-sm text-gray-600" dir="rtl">
                        {clinic.nameAr}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{clinic.city}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{clinic.phone}</div>
                      <div className="text-gray-600">{clinic.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {clinic.staff}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {clinic.patients}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={clinic.status === "active" ? "default" : "secondary"}>{clinic.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 bg-transparent">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
