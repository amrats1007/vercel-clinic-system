import type { Language } from "./i18n"

// Arabic-Indic digits mapping
const arabicDigits = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"]
const westernDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"]

export function toArabicDigits(str: string): string {
  return str.replace(/[0-9]/g, (digit) => arabicDigits[Number.parseInt(digit)])
}

export function toWesternDigits(str: string): string {
  return str.replace(/[٠-٩]/g, (digit) => {
    const index = arabicDigits.indexOf(digit)
    return index !== -1 ? westernDigits[index] : digit
  })
}

export function formatDate(date: Date, language: Language = "en"): string {
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  const locale = language === "ar" ? "ar-SA" : "en-US"
  let formatted = date.toLocaleDateString(locale, options)

  if (language === "ar") {
    formatted = toArabicDigits(formatted)
  }

  return formatted
}

export function formatTime(date: Date, language: Language = "en"): string {
  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }

  const locale = language === "ar" ? "ar-SA" : "en-US"
  let formatted = date.toLocaleTimeString(locale, options)

  if (language === "ar") {
    formatted = toArabicDigits(formatted)
    // Replace AM/PM with Arabic equivalents
    formatted = formatted.replace(/AM/g, "ص").replace(/PM/g, "م")
  }

  return formatted
}

export function formatDateTime(date: Date, language: Language = "en"): string {
  return `${formatDate(date, language)} ${formatTime(date, language)}`
}

export function formatRelativeTime(date: Date, language: Language = "en", timezone?: string): string {
  // Use user's timezone or default to system timezone
  const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  
  // Create timezone-aware dates for comparison
  const now = new Date()
  const inputDate = new Date(date)
  
  // Get the start of day for both dates in the user's timezone
  const nowStartOfDay = new Date(now.toLocaleDateString('en-CA', { timeZone: userTimezone }) + 'T00:00:00')
  const inputStartOfDay = new Date(inputDate.toLocaleDateString('en-CA', { timeZone: userTimezone }) + 'T00:00:00')
  
  // Calculate difference in days using timezone-aware dates
  const diffInMs = inputStartOfDay.getTime() - nowStartOfDay.getTime()
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) {
    return language === "ar" ? "اليوم" : "Today"
  } else if (diffInDays === 1) {
    return language === "ar" ? "غداً" : "Tomorrow"
  } else if (diffInDays === -1) {
    return language === "ar" ? "أمس" : "Yesterday"
  } else if (diffInDays > 1 && diffInDays <= 7) {
    // Show day name for dates within a week
    const dayIndex = inputDate.getDay()
    return getDayName(dayIndex, language)
  } else {
    return formatDate(date, language)
  }
}

export function parseTimeString(timeStr: string): { hours: number; minutes: number } {
  const [time, period] = timeStr.split(" ")
  const [hours, minutes] = time.split(":").map(Number)

  let adjustedHours = hours
  if (period?.toLowerCase() === "pm" || period === "م") {
    if (hours !== 12) adjustedHours += 12
  } else if (period?.toLowerCase() === "am" || period === "ص") {
    if (hours === 12) adjustedHours = 0
  }

  return { hours: adjustedHours, minutes }
}

export function createTimeFromString(timeStr: string, date: Date = new Date()): Date {
  const { hours, minutes } = parseTimeString(timeStr)
  const newDate = new Date(date)
  newDate.setHours(hours, minutes, 0, 0)
  return newDate
}

export function getDayName(dayIndex: number, language: Language = "en"): string {
  const days = {
    en: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    ar: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
  }
  return days[language][dayIndex] || days.en[dayIndex]
}

export function isToday(date: Date, timezone?: string): boolean {
  const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  const today = new Date()
  
  // Compare dates in user's timezone
  const todayStr = today.toLocaleDateString('en-CA', { timeZone: userTimezone })
  const dateStr = date.toLocaleDateString('en-CA', { timeZone: userTimezone })
  
  return todayStr === dateStr
}

export function isTomorrow(date: Date, timezone?: string): boolean {
  const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  
  // Compare dates in user's timezone
  const tomorrowStr = tomorrow.toLocaleDateString('en-CA', { timeZone: userTimezone })
  const dateStr = date.toLocaleDateString('en-CA', { timeZone: userTimezone })
  
  return tomorrowStr === dateStr
}

export function isYesterday(date: Date, timezone?: string): boolean {
  const userTimezone = timezone || Intl.DateTimeFormat().resolvedOptions().timeZone
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  
  // Compare dates in user's timezone
  const yesterdayStr = yesterday.toLocaleDateString('en-CA', { timeZone: userTimezone })
  const dateStr = date.toLocaleDateString('en-CA', { timeZone: userTimezone })
  
  return yesterdayStr === dateStr
}

export function isFutureDate(date: Date): boolean {
  return date.getTime() > new Date().getTime()
}

export function formatDuration(minutes: number, language: Language = "en"): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (language === "ar") {
    if (hours > 0 && remainingMinutes > 0) {
      return `${toArabicDigits(hours.toString())} ساعة ${toArabicDigits(remainingMinutes.toString())} دقيقة`
    } else if (hours > 0) {
      return `${toArabicDigits(hours.toString())} ساعة`
    } else {
      return `${toArabicDigits(remainingMinutes.toString())} دقيقة`
    }
  } else {
    if (hours > 0 && remainingMinutes > 0) {
      return `${hours}h ${remainingMinutes}m`
    } else if (hours > 0) {
      return `${hours}h`
    } else {
      return `${remainingMinutes}m`
    }
  }
}

// Hijri calendar support (basic implementation)
export function formatHijriDate(date: Date, language: Language = "en"): string {
  try {
    const hijriOptions: Intl.DateTimeFormatOptions = {
      calendar: "islamic",
      year: "numeric",
      month: "long",
      day: "numeric",
    }

    const locale = language === "ar" ? "ar-SA-u-ca-islamic" : "en-US-u-ca-islamic"
    let formatted = date.toLocaleDateString(locale, hijriOptions)

    if (language === "ar") {
      formatted = toArabicDigits(formatted)
    }

    return formatted
  } catch (error) {
    // Fallback to Gregorian if Hijri is not supported
    return formatDate(date, language)
  }
}
