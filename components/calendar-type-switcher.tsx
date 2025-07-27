"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import type { Language } from "@/lib/i18n"
import { getTranslation } from "@/lib/i18n"

interface CalendarTypeSwitcherProps {
  language: Language
  calendarType: "gregorian" | "hijri"
  onCalendarTypeChange: (type: "gregorian" | "hijri") => void
}

export function CalendarTypeSwitcher({ language, calendarType, onCalendarTypeChange }: CalendarTypeSwitcherProps) {
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  if (language !== "ar") {
    return null // Only show for Arabic language
  }

  return (
    <Select value={calendarType} onValueChange={(value: "gregorian" | "hijri") => onCalendarTypeChange(value)}>
      <SelectTrigger className="w-48">
        <Calendar className="w-4 h-4 mr-2 rtl:mr-0 rtl:ml-2" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="gregorian">{t("gregorianCalendar")}</SelectItem>
        <SelectItem value="hijri">{t("hijriCalendar")}</SelectItem>
      </SelectContent>
    </Select>
  )
}
