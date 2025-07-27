"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Calendar, Clock, Plus, Trash2 } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import { formatTime } from "@/lib/date-utils"

interface ScheduleSlot {
  id: string
  dayOfWeek: number
  startTime: string
  endTime: string
  isAvailable: boolean
  slotDuration: number
}

interface WeeklySchedule {
  [key: number]: ScheduleSlot[]
}

const DAYS_OF_WEEK = [
  { value: 0, label: "Sunday", labelAr: "الأحد" },
  { value: 1, label: "Monday", labelAr: "الاثنين" },
  { value: 2, label: "Tuesday", labelAr: "الثلاثاء" },
  { value: 3, label: "Wednesday", labelAr: "الأربعاء" },
  { value: 4, label: "Thursday", labelAr: "الخميس" },
  { value: 5, label: "Friday", labelAr: "الجمعة" },
  { value: 6, label: "Saturday", labelAr: "السبت" },
]

export function ScheduleManagement() {
  const { language } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  const [schedule, setSchedule] = useState<WeeklySchedule>({})
  const [isEditing, setIsEditing] = useState(false)
  const [newSlot, setNewSlot] = useState({
    dayOfWeek: 1,
    startTime: "09:00",
    endTime: "17:00",
    slotDuration: 30,
    isAvailable: true,
  })

  // Mock data
  useEffect(() => {
    const mockSchedule: WeeklySchedule = {
      1: [
        {
          id: "1",
          dayOfWeek: 1,
          startTime: "09:00",
          endTime: "12:00",
          isAvailable: true,
          slotDuration: 30,
        },
        {
          id: "2",
          dayOfWeek: 1,
          startTime: "14:00",
          endTime: "17:00",
          isAvailable: true,
          slotDuration: 30,
        },
      ],
      2: [
        {
          id: "3",
          dayOfWeek: 2,
          startTime: "09:00",
          endTime: "12:00",
          isAvailable: true,
          slotDuration: 30,
        },
        {
          id: "4",
          dayOfWeek: 2,
          startTime: "14:00",
          endTime: "17:00",
          isAvailable: true,
          slotDuration: 30,
        },
      ],
      3: [
        {
          id: "5",
          dayOfWeek: 3,
          startTime: "09:00",
          endTime: "12:00",
          isAvailable: true,
          slotDuration: 30,
        },
      ],
      4: [
        {
          id: "6",
          dayOfWeek: 4,
          startTime: "09:00",
          endTime: "12:00",
          isAvailable: true,
          slotDuration: 30,
        },
        {
          id: "7",
          dayOfWeek: 4,
          startTime: "14:00",
          endTime: "17:00",
          isAvailable: true,
          slotDuration: 30,
        },
      ],
      5: [
        {
          id: "8",
          dayOfWeek: 5,
          startTime: "09:00",
          endTime: "12:00",
          isAvailable: true,
          slotDuration: 30,
        },
      ],
    }
    setSchedule(mockSchedule)
  }, [])

  const addScheduleSlot = () => {
    const id = Date.now().toString()
    const slot: ScheduleSlot = {
      id,
      ...newSlot,
    }

    setSchedule((prev) => ({
      ...prev,
      [newSlot.dayOfWeek]: [...(prev[newSlot.dayOfWeek] || []), slot],
    }))

    // Reset form
    setNewSlot({
      dayOfWeek: 1,
      startTime: "09:00",
      endTime: "17:00",
      slotDuration: 30,
      isAvailable: true,
    })
  }

  const removeScheduleSlot = (dayOfWeek: number, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayOfWeek]: prev[dayOfWeek]?.filter((slot) => slot.id !== slotId) || [],
    }))
  }

  const toggleSlotAvailability = (dayOfWeek: number, slotId: string) => {
    setSchedule((prev) => ({
      ...prev,
      [dayOfWeek]:
        prev[dayOfWeek]?.map((slot) => (slot.id === slotId ? { ...slot, isAvailable: !slot.isAvailable } : slot)) || [],
    }))
  }

  const calculateTotalSlots = (slot: ScheduleSlot) => {
    const start = new Date(`2000-01-01T${slot.startTime}:00`)
    const end = new Date(`2000-01-01T${slot.endTime}:00`)
    const diffMinutes = (end.getTime() - start.getTime()) / (1000 * 60)
    return Math.floor(diffMinutes / slot.slotDuration)
  }

  const getDayLabel = (day: { value: number; label: string; labelAr: string }) => {
    return language === "ar" ? day.labelAr : day.label
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("scheduleManagement")}</CardTitle>
              <CardDescription>{t("manageWeeklyAvailability")}</CardDescription>
            </div>
            <Button onClick={() => setIsEditing(!isEditing)}>{isEditing ? t("doneEditing") : t("editSchedule")}</Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Add New Slot Form */}
          {isEditing && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-lg">{t("addNewTimeSlot")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <Label>{t("day")}</Label>
                    <Select
                      value={newSlot.dayOfWeek.toString()}
                      onValueChange={(value) => setNewSlot((prev) => ({ ...prev, dayOfWeek: Number.parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {DAYS_OF_WEEK.map((day) => (
                          <SelectItem key={day.value} value={day.value.toString()}>
                            {getDayLabel(day)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>{t("startTime")}</Label>
                    <Input
                      type="time"
                      value={newSlot.startTime}
                      onChange={(e) => setNewSlot((prev) => ({ ...prev, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>{t("endTime")}</Label>
                    <Input
                      type="time"
                      value={newSlot.endTime}
                      onChange={(e) => setNewSlot((prev) => ({ ...prev, endTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label>{t("slotDuration")}</Label>
                    <Select
                      value={newSlot.slotDuration.toString()}
                      onValueChange={(value) =>
                        setNewSlot((prev) => ({ ...prev, slotDuration: Number.parseInt(value) }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 {t("minutes")}</SelectItem>
                        <SelectItem value="30">30 {t("minutes")}</SelectItem>
                        <SelectItem value="45">45 {t("minutes")}</SelectItem>
                        <SelectItem value="60">60 {t("minutes")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={addScheduleSlot} className="w-full">
                      <Plus className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
                      {t("addSlot")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Weekly Schedule Display */}
          <div className="space-y-4">
            {DAYS_OF_WEEK.map((day) => (
              <Card key={day.value}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Calendar className="w-5 h-5 mr-2 rtl:mr-0 rtl:ml-2" />
                    {getDayLabel(day)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {schedule[day.value]?.length > 0 ? (
                    <div className="space-y-3">
                      {schedule[day.value].map((slot) => (
                        <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-4 rtl:space-x-reverse">
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Clock className="w-4 h-4 text-gray-600" />
                              <span className="font-medium">
                                {formatTime(slot.startTime, language)} - {formatTime(slot.endTime, language)}
                              </span>
                            </div>
                            <Badge variant="outline">
                              {calculateTotalSlots(slot)} {t("slots")} ({slot.slotDuration}
                              {t("minEach")})
                            </Badge>
                            <Badge
                              className={slot.isAvailable ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}
                            >
                              {slot.isAvailable ? t("available") : t("unavailable")}
                            </Badge>
                          </div>
                          {isEditing && (
                            <div className="flex items-center space-x-2 rtl:space-x-reverse">
                              <Switch
                                checked={slot.isAvailable}
                                onCheckedChange={() => toggleSlotAvailability(day.value, slot.id)}
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeScheduleSlot(day.value, slot.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      {t("noScheduleSet")} {getDayLabel(day)}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("weeklySummary")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {Object.values(schedule).reduce(
                  (total, daySlots) => total + daySlots.filter((slot) => slot.isAvailable).length,
                  0,
                )}
              </div>
              <div className="text-sm text-gray-600">{t("activeTimeBlocks")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {Object.values(schedule).reduce(
                  (total, daySlots) =>
                    total +
                    daySlots
                      .filter((slot) => slot.isAvailable)
                      .reduce((slotTotal, slot) => slotTotal + calculateTotalSlots(slot), 0),
                  0,
                )}
              </div>
              <div className="text-sm text-gray-600">{t("availableSlots")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{Object.keys(schedule).length}</div>
              <div className="text-sm text-gray-600">{t("workingDays")}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {Object.values(schedule)
                  .reduce(
                    (total, daySlots) =>
                      total +
                      daySlots.reduce((dayTotal, slot) => {
                        const start = new Date(`2000-01-01T${slot.startTime}:00`)
                        const end = new Date(`2000-01-01T${slot.endTime}:00`)
                        return dayTotal + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
                      }, 0),
                    0,
                  )
                  .toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">{t("hoursPerWeek")}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
