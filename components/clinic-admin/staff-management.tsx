"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserPlus, Search, Edit, Trash2, User, Mail, Phone, Loader2 } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

interface StaffMember {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "doctor" | "secretary" | "purchasing"
  department: string
  specialization?: string
  licenseNumber?: string
  hireDate: string
  isActive: boolean
}

interface StaffManagementProps {
  clinicId: string
  clinicName: string
}

export function StaffManagement({ clinicId, clinicName }: StaffManagementProps) {
  const { language } = useLanguage()
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [newStaff, setNewStaff] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
    department: "",
    specialization: "",
    licenseNumber: "",
    password: "",
  })

  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  // Mock data for demonstration
  useEffect(() => {
    const mockStaff: StaffMember[] = [
      {
        id: "1",
        firstName: "Sarah",
        lastName: "Ahmed",
        email: "dr.sarah@centralmedical.com",
        phone: "+966123456789",
        role: "doctor",
        department: "Cardiology",
        specialization: "Interventional Cardiology",
        licenseNumber: "DOC-2024-001",
        hireDate: "2024-01-15",
        isActive: true,
      },
      {
        id: "2",
        firstName: "Fatima",
        lastName: "Al-Zahra",
        email: "fatima@centralmedical.com",
        phone: "+966123456790",
        role: "secretary",
        department: "Reception",
        hireDate: "2024-01-12",
        isActive: true,
      },
      {
        id: "3",
        firstName: "Ahmed",
        lastName: "Hassan",
        email: "ahmed@centralmedical.com",
        phone: "+966123456791",
        role: "purchasing",
        department: "Procurement",
        hireDate: "2024-01-10",
        isActive: true,
      },
    ]
    setStaff(mockStaff)
  }, [])

  const handleCreateStaff = async () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch("/api/staff/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newStaff,
          clinicId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(t("staffCreatedSuccessfully"))
        setIsAddDialogOpen(false)
        setNewStaff({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          role: "",
          department: "",
          specialization: "",
          licenseNumber: "",
          password: "",
        })
        // Refresh staff list
        // fetchStaff()
      } else {
        setError(data.error || t("failedToCreateStaff"))
      }
    } catch (error) {
      setError(t("errorOccurred"))
    } finally {
      setIsLoading(false)
    }
  }

  const filteredStaff = staff.filter((member) => {
    const matchesSearch =
      `${member.firstName} ${member.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.department.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesRole = roleFilter === "all" || member.role === roleFilter

    return matchesSearch && matchesRole
  })

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "doctor":
        return "bg-blue-100 text-blue-800"
      case "secretary":
        return "bg-green-100 text-green-800"
      case "purchasing":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const generatePassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setNewStaff({ ...newStaff, password })
  }

  return (
    <div className="space-y-6">
      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("staffManagement")}</CardTitle>
              <CardDescription>
                {t("manageStaffFor")} {clinicName}
              </CardDescription>
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
              {t("addStaff")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 rtl:left-auto rtl:right-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder={t("searchStaff")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rtl:pl-4 rtl:pr-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("allRoles")}</SelectItem>
                <SelectItem value="doctor">{t("doctors")}</SelectItem>
                <SelectItem value="secretary">{t("secretaries")}</SelectItem>
                <SelectItem value="purchasing">{t("purchasing")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Staff Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("staff")}</TableHead>
                  <TableHead>{t("contact")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead>{t("department")}</TableHead>
                  <TableHead>{t("hireDate")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead>{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStaff.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3 rtl:space-x-reverse">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {member.firstName} {member.lastName}
                          </div>
                          <div className="text-sm text-gray-600">ID: {member.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1 text-gray-600" />
                          {member.email}
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="w-3 h-3 mr-1 rtl:mr-0 rtl:ml-1 text-gray-600" />
                          {member.phone}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(member.role)}>{t(member.role)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{member.department}</div>
                        {member.specialization && <div className="text-sm text-gray-600">{member.specialization}</div>}
                      </div>
                    </TableCell>
                    <TableCell>{new Date(member.hireDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={member.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                        {member.isActive ? t("active") : t("inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredStaff.length === 0 && <div className="text-center py-8 text-gray-500">{t("noStaffFound")}</div>}
        </CardContent>
      </Card>

      {/* Add Staff Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("addNewStaff")}</DialogTitle>
            <DialogDescription>{t("createStaffAccount")}</DialogDescription>
          </DialogHeader>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">{t("firstName")}</Label>
                <Input
                  id="firstName"
                  value={newStaff.firstName}
                  onChange={(e) => setNewStaff({ ...newStaff, firstName: e.target.value })}
                  placeholder={t("enterFirstName")}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="lastName">{t("lastName")}</Label>
                <Input
                  id="lastName"
                  value={newStaff.lastName}
                  onChange={(e) => setNewStaff({ ...newStaff, lastName: e.target.value })}
                  placeholder={t("enterLastName")}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder={t("enterEmail")}
                  disabled={isLoading}
                />
              </div>
              <div>
                <Label htmlFor="phone">{t("phone")}</Label>
                <Input
                  id="phone"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
                  placeholder={t("enterPhone")}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="role">{t("role")}</Label>
                <Select
                  value={newStaff.role}
                  onValueChange={(value) => setNewStaff({ ...newStaff, role: value })}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="doctor">{t("doctor")}</SelectItem>
                    <SelectItem value="secretary">{t("secretary")}</SelectItem>
                    <SelectItem value="purchasing">{t("purchasing")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="department">{t("department")}</Label>
                <Input
                  id="department"
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({ ...newStaff, department: e.target.value })}
                  placeholder={t("enterDepartment")}
                  disabled={isLoading}
                />
              </div>
            </div>

            {newStaff.role === "doctor" && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="specialization">{t("specialization")}</Label>
                  <Input
                    id="specialization"
                    value={newStaff.specialization}
                    onChange={(e) => setNewStaff({ ...newStaff, specialization: e.target.value })}
                    placeholder={t("enterSpecialization")}
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label htmlFor="licenseNumber">{t("licenseNumber")}</Label>
                  <Input
                    id="licenseNumber"
                    value={newStaff.licenseNumber}
                    onChange={(e) => setNewStaff({ ...newStaff, licenseNumber: e.target.value })}
                    placeholder={t("enterLicenseNumber")}
                    disabled={isLoading}
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="password">{t("temporaryPassword")}</Label>
              <div className="flex gap-2">
                <Input
                  id="password"
                  type="text"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({ ...newStaff, password: e.target.value })}
                  placeholder={t("enterPassword")}
                  disabled={isLoading}
                />
                <Button type="button" variant="outline" onClick={generatePassword} disabled={isLoading}>
                  {t("generate")}
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-1">{t("staffWillChangePassword")}</p>
            </div>

            <div className="flex justify-end space-x-2 rtl:space-x-reverse">
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={isLoading}>
                {t("cancel")}
              </Button>
              <Button onClick={handleCreateStaff} disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:mr-0 rtl:ml-2" />}
                {t("createAccount")}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
