"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Building2, Clock, DollarSign, Users } from "lucide-react"

interface ClinicSettingsProps {
  clinicId: string
}

export function ClinicSettings({ clinicId }: ClinicSettingsProps) {
  const [settings, setSettings] = useState({
    name: "City Medical Center",
    nameAr: "مركز المدينة الطبي",
    description: "A comprehensive medical center providing quality healthcare services",
    address: "123 Main Street, Downtown",
    city: "Riyadh",
    phone: "+966-11-123-4567",
    email: "info@citymedical.com",
    website: "www.citymedical.com",
    licenseNumber: "LIC-001-2024",
    workingHours: {
      sunday: { open: "08:00", close: "20:00", enabled: true },
      monday: { open: "08:00", close: "20:00", enabled: true },
      tuesday: { open: "08:00", close: "20:00", enabled: true },
      wednesday: { open: "08:00", close: "20:00", enabled: true },
      thursday: { open: "08:00", close: "20:00", enabled: true },
      friday: { open: "14:00", close: "20:00", enabled: true },
      saturday: { open: "08:00", close: "20:00", enabled: false },
    },
    appointmentSettings: {
      slotDuration: 30,
      advanceBookingDays: 30,
      cancellationHours: 24,
      allowOnlineBooking: true,
      requireConfirmation: true,
    },
    paymentSettings: {
      acceptCash: true,
      acceptCard: true,
      acceptInsurance: true,
      consultationFee: 200,
      currency: "SAR",
    },
  })

  const handleSaveSettings = () => {
    console.log("Saving clinic settings:", settings)
  }

  const days = [
    { key: "sunday", label: "Sunday", labelAr: "الأحد" },
    { key: "monday", label: "Monday", labelAr: "الإثنين" },
    { key: "tuesday", label: "Tuesday", labelAr: "الثلاثاء" },
    { key: "wednesday", label: "Wednesday", labelAr: "الأربعاء" },
    { key: "thursday", label: "Thursday", labelAr: "الخميس" },
    { key: "friday", label: "Friday", labelAr: "الجمعة" },
    { key: "saturday", label: "Saturday", labelAr: "السبت" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Clinic Settings</h2>
        <p className="text-gray-600">Configure your clinic's information and preferences</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="appointments">Appointments</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2" />
                General Information
              </CardTitle>
              <CardDescription>Basic clinic information and contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Clinic Name (English)</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameAr">Clinic Name (Arabic)</Label>
                  <Input
                    id="nameAr"
                    value={settings.nameAr}
                    onChange={(e) => setSettings({ ...settings, nameAr: e.target.value })}
                    className="text-right"
                    dir="rtl"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={settings.description}
                  onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings.address}
                    onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={settings.city}
                    onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={settings.website}
                    onChange={(e) => setSettings({ ...settings, website: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="licenseNumber">License Number</Label>
                <Input
                  id="licenseNumber"
                  value={settings.licenseNumber}
                  onChange={(e) => setSettings({ ...settings, licenseNumber: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Working Hours
              </CardTitle>
              <CardDescription>Set your clinic's operating schedule</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {days.map((day) => (
                <div key={day.key} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Switch
                      checked={settings.workingHours[day.key as keyof typeof settings.workingHours].enabled}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          workingHours: {
                            ...settings.workingHours,
                            [day.key]: {
                              ...settings.workingHours[day.key as keyof typeof settings.workingHours],
                              enabled: checked,
                            },
                          },
                        })
                      }
                    />
                    <div>
                      <p className="font-medium">{day.label}</p>
                      <p className="text-sm text-gray-600" dir="rtl">
                        {day.labelAr}
                      </p>
                    </div>
                  </div>
                  {settings.workingHours[day.key as keyof typeof settings.workingHours].enabled && (
                    <div className="flex items-center space-x-2">
                      <Input
                        type="time"
                        value={settings.workingHours[day.key as keyof typeof settings.workingHours].open}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            workingHours: {
                              ...settings.workingHours,
                              [day.key]: {
                                ...settings.workingHours[day.key as keyof typeof settings.workingHours],
                                open: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-24"
                      />
                      <span>to</span>
                      <Input
                        type="time"
                        value={settings.workingHours[day.key as keyof typeof settings.workingHours].close}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            workingHours: {
                              ...settings.workingHours,
                              [day.key]: {
                                ...settings.workingHours[day.key as keyof typeof settings.workingHours],
                                close: e.target.value,
                              },
                            },
                          })
                        }
                        className="w-24"
                      />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2" />
                Appointment Settings
              </CardTitle>
              <CardDescription>Configure appointment booking preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="slotDuration">Appointment Duration (minutes)</Label>
                  <Input
                    id="slotDuration"
                    type="number"
                    value={settings.appointmentSettings.slotDuration}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appointmentSettings: {
                          ...settings.appointmentSettings,
                          slotDuration: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="advanceBookingDays">Advance Booking (days)</Label>
                  <Input
                    id="advanceBookingDays"
                    type="number"
                    value={settings.appointmentSettings.advanceBookingDays}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appointmentSettings: {
                          ...settings.appointmentSettings,
                          advanceBookingDays: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cancellationHours">Cancellation Notice (hours)</Label>
                  <Input
                    id="cancellationHours"
                    type="number"
                    value={settings.appointmentSettings.cancellationHours}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        appointmentSettings: {
                          ...settings.appointmentSettings,
                          cancellationHours: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowOnlineBooking">Allow Online Booking</Label>
                    <p className="text-sm text-gray-600">Enable patients to book appointments online</p>
                  </div>
                  <Switch
                    id="allowOnlineBooking"
                    checked={settings.appointmentSettings.allowOnlineBooking}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        appointmentSettings: {
                          ...settings.appointmentSettings,
                          allowOnlineBooking: checked,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireConfirmation">Require Confirmation</Label>
                    <p className="text-sm text-gray-600">Appointments need staff confirmation</p>
                  </div>
                  <Switch
                    id="requireConfirmation"
                    checked={settings.appointmentSettings.requireConfirmation}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        appointmentSettings: {
                          ...settings.appointmentSettings,
                          requireConfirmation: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <DollarSign className="h-5 w-5 mr-2" />
                Payment Settings
              </CardTitle>
              <CardDescription>Configure payment methods and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="consultationFee">Consultation Fee</Label>
                  <Input
                    id="consultationFee"
                    type="number"
                    value={settings.paymentSettings.consultationFee}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paymentSettings: {
                          ...settings.paymentSettings,
                          consultationFee: Number.parseInt(e.target.value),
                        },
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input
                    id="currency"
                    value={settings.paymentSettings.currency}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        paymentSettings: {
                          ...settings.paymentSettings,
                          currency: e.target.value,
                        },
                      })
                    }
                    disabled
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="acceptCash">Accept Cash Payments</Label>
                    <p className="text-sm text-gray-600">Allow cash payments at the clinic</p>
                  </div>
                  <Switch
                    id="acceptCash"
                    checked={settings.paymentSettings.acceptCash}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        paymentSettings: {
                          ...settings.paymentSettings,
                          acceptCash: checked,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="acceptCard">Accept Card Payments</Label>
                    <p className="text-sm text-gray-600">Accept credit/debit card payments</p>
                  </div>
                  <Switch
                    id="acceptCard"
                    checked={settings.paymentSettings.acceptCard}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        paymentSettings: {
                          ...settings.paymentSettings,
                          acceptCard: checked,
                        },
                      })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="acceptInsurance">Accept Insurance</Label>
                    <p className="text-sm text-gray-600">Accept insurance payments</p>
                  </div>
                  <Switch
                    id="acceptInsurance"
                    checked={settings.paymentSettings.acceptInsurance}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        paymentSettings: {
                          ...settings.paymentSettings,
                          acceptInsurance: checked,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings}>Save Settings</Button>
      </div>
    </div>
  )
}
