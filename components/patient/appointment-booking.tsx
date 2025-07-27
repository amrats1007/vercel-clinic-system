"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle } from "lucide-react"

// Import the new utilities
import { formatTime } from "@/lib/date-utils"
import { PriceDisplay } from "@/components/ui/price-display"
import { DatePicker } from "@/components/ui/date-picker"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

interface Doctor {
  id: string
  name: string
  specialization: string
  fee: number
}

interface TimeSlot {
  time: string
  available: boolean
}

interface AppointmentBookingProps {
  userId: string
}

export function AppointmentBooking({ userId }: AppointmentBookingProps) {
  const { language } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [selectedDoctor, setSelectedDoctor] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [notes, setNotes] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch("/api/doctors")
        const data = await response.json()
        if (response.ok) {
          setDoctors(data.doctors)
        } else {
          setError(t("failedToLoadDoctors"))
        }
      } catch (error) {
        setError(t("failedToLoadDoctors"))
      }
    }

    fetchDoctors()
  }, []) // Removed t from the dependency array

  // Mock available time slots
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      const slots: TimeSlot[] = [
        { time: "09:00", available: true },
        { time: "09:30", available: false },
        { time: "10:00", available: true },
        { time: "10:30", available: true },
        { time: "11:00", available: false },
        { time: "11:30", available: true },
        { time: "14:00", available: true },
        { time: "14:30", available: true },
        { time: "15:00", available: false },
        { time: "15:30", available: true },
        { time: "16:00", available: true },
        { time: "16:30", available: true },
      ]
      setAvailableSlots(slots)
    }
  }, [selectedDoctor, selectedDate])

  const handleBookAppointment = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime) {
      setError(t("fillRequiredFields"))
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          doctorId: selectedDoctor,
          date: selectedDate.toISOString().split("T")[0],
          time: selectedTime,
          notes,
        }),
      })

      if (response.ok) {
        setSuccess(true)
        // Reset form
        setSelectedDoctor("")
        setSelectedDate(undefined)
        setSelectedTime("")
        setNotes("")
      } else {
        const data = await response.json()
        setError(data.error || t("failedToBookAppointment"))
      }
    } catch (error) {
      setError(t("errorOccurred"))
    } finally {
      setIsLoading(false)
    }
  }

  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor)

  if (success) {
    return (
      <Card>
        <CardContent className="pt-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">{t("appointmentBookedSuccess")}</h3>
          <p className="text-gray-600 mb-4">{t("appointmentBookedDesc")}</p>
          <Button onClick={() => setSuccess(false)}>{t("bookAnotherAppointment")}</Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t("bookNewAppointmentTitle")}</CardTitle>
          <CardDescription>{t("bookNewAppointmentDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Doctor Selection */}
          <div className="space-y-2">
            <Label>{t("selectDoctor")}</Label>
            <Select value={selectedDoctor} onValueChange={setSelectedDoctor}>
              <SelectTrigger>
                <SelectValue placeholder={t("chooseDoctor")} />
              </SelectTrigger>
              <SelectContent>
                {doctors.map((doctor) => (
                  <SelectItem key={doctor.id} value={doctor.id}>
                    <div className="flex justify-between items-center w-full">
                      <div>
                        <div className="font-medium">{doctor.name}</div>
                        <div className="text-sm text-gray-600">{doctor.specialization}</div>
                      </div>
                      <PriceDisplay price={doctor.fee} language={language} currencyCode="USD" size="sm" />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Consultation Fee Display */}
          {selectedDoctorData && (
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-medium">{t("consultationFee")}:</span>
                <PriceDisplay price={selectedDoctorData.fee} language={language} currencyCode="USD" size="lg" />
              </div>
            </div>
          )}

          {/* Date Selection */}
          {selectedDoctor && (
            <div className="space-y-2">
              <Label>{t("selectDate")}</Label>
              <DatePicker
                date={selectedDate}
                onDateChange={setSelectedDate}
                language={language}
                placeholder={t("pickDate")}
                disabled={(date) => date < new Date() || date.getDay() === 0}
              />
            </div>
          )}

          {/* Time Selection */}
          {selectedDate && availableSlots.length > 0 && (
            <div className="space-y-2">
              <Label>{t("availableTimeSlots")}</Label>
              <div className="grid grid-cols-3 gap-2">
                {availableSlots.map((slot) => (
                  <Button
                    key={slot.time}
                    variant={selectedTime === slot.time ? "default" : "outline"}
                    disabled={!slot.available}
                    onClick={() => setSelectedTime(slot.time)}
                    className="h-12"
                  >
                    {formatTime(slot.time, language)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {selectedTime && (
            <div className="space-y-2">
              <Label htmlFor="notes">{t("additionalNotes")}</Label>
              <Textarea
                id="notes"
                placeholder={t("notesPlaceholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          )}

          {/* Book Button */}
          {selectedTime && (
            <Button onClick={handleBookAppointment} disabled={isLoading} className="w-full">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:mr-0 rtl:ml-2" />}
              {t("bookAppointment")}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
