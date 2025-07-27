"use client"

import { useState, useEffect } from "react"
import type { Language } from "@/lib/i18n"

export function useCalendarSettings(language: Language) {
  const [calendarType, setCalendarType] = useState<"gregorian" | "hijri">("gregorian")

  useEffect(() => {
    // Get calendar preference from localStorage
    const savedCalendar = localStorage.getItem("calendarType") as "gregorian" | "hijri"
    if (savedCalendar && (savedCalendar === "gregorian" || savedCalendar === "hijri")) {
      setCalendarType(savedCalendar)
    } else if (language === "ar") {
      // Default to Hijri for Arabic users
      setCalendarType("hijri")
    }
  }, [language])

  useEffect(() => {
    // Save calendar preference
    localStorage.setItem("calendarType", calendarType)
  }, [calendarType])

  return { calendarType, setCalendarType }
}
