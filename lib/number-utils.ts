import type { Language } from "./i18n"
import { toArabicDigits, toWesternDigits } from "./date-utils"

// Currency configurations for different locales
export const currencyConfig = {
  en: {
    symbol: "$",
    position: "before", // before or after the number
    separator: ",",
    decimal: ".",
    decimalPlaces: 2,
  },
  ar: {
    symbol: "ر.س", // Saudi Riyal as default, can be configured
    position: "after",
    separator: "،", // Arabic comma
    decimal: "٫", // Arabic decimal separator
    decimalPlaces: 2,
  },
} as const

// Alternative currency symbols for Arabic
export const arabicCurrencySymbols = {
  USD: "د.أ", // US Dollar
  EUR: "يورو",
  GBP: "ج.إ", // British Pound
  SAR: "ر.س", // Saudi Riyal
  AED: "د.إ", // UAE Dirham
  EGP: "ج.م", // Egyptian Pound
  JOD: "د.أ", // Jordanian Dinar
  KWD: "د.ك", // Kuwaiti Dinar
  QAR: "ر.ق", // Qatari Riyal
  BHD: "د.ب", // Bahraini Dinar
  OMR: "ر.ع", // Omani Rial
  LBP: "ل.ل", // Lebanese Pound
  IQD: "د.ع", // Iraqi Dinar
  SYP: "ل.س", // Syrian Pound
  MAD: "د.م", // Moroccan Dirham
  TND: "د.ت", // Tunisian Dinar
  DZD: "د.ج", // Algerian Dinar
  LYD: "د.ل", // Libyan Dinar
} as const

// Format number with thousands separators
export function formatNumber(
  num: number,
  language: Language,
  options?: {
    useGrouping?: boolean
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  },
): string {
  const { useGrouping = true, minimumFractionDigits = 0, maximumFractionDigits = 2 } = options || {}

  if (language === "ar") {
    // Format number with Arabic separators
    const formatted = num.toLocaleString("en-US", {
      useGrouping,
      minimumFractionDigits,
      maximumFractionDigits,
    })

    // Replace separators with Arabic equivalents
    return toArabicDigits(formatted.replace(/,/g, "،").replace(/\./g, "٫"))
  }

  return num.toLocaleString("en-US", {
    useGrouping,
    minimumFractionDigits,
    maximumFractionDigits,
  })
}

// Format currency
export function formatCurrency(
  amount: number,
  language: Language,
  currencyCode: keyof typeof arabicCurrencySymbols = "USD",
  options?: {
    showSymbol?: boolean
    showCode?: boolean
    minimumFractionDigits?: number
    maximumFractionDigits?: number
  },
): string {
  const { showSymbol = true, showCode = false, minimumFractionDigits = 2, maximumFractionDigits = 2 } = options || {}

  const config = currencyConfig[language]
  const formattedNumber = formatNumber(amount, language, {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping: true,
  })

  let result = formattedNumber

  if (showSymbol) {
    const symbol = language === "ar" ? arabicCurrencySymbols[currencyCode] || config.symbol : config.symbol

    if (config.position === "before") {
      result = `${symbol} ${formattedNumber}`
    } else {
      result = `${formattedNumber} ${symbol}`
    }
  }

  if (showCode && !showSymbol) {
    result = `${formattedNumber} ${currencyCode}`
  }

  return result
}

// Format percentage
export function formatPercentage(
  value: number,
  language: Language,
  options?: {
    minimumFractionDigits?: number
    maximumFractionDigits?: number
    showSign?: boolean
  },
): string {
  const { minimumFractionDigits = 0, maximumFractionDigits = 1, showSign = true } = options || {}

  const formattedNumber = formatNumber(value, language, {
    minimumFractionDigits,
    maximumFractionDigits,
    useGrouping: false,
  })

  if (language === "ar") {
    return showSign ? `${formattedNumber}٪` : formattedNumber
  }

  return showSign ? `${formattedNumber}%` : formattedNumber
}

// Parse currency input (remove formatting and convert to number)
export function parseCurrency(input: string, language: Language): number {
  if (language === "ar") {
    // Convert Arabic digits and separators
    let cleaned = toWesternDigits(input)
    cleaned = cleaned.replace(/،/g, "").replace(/٫/g, ".")
    // Remove Arabic currency symbols
    Object.values(arabicCurrencySymbols).forEach((symbol) => {
      cleaned = cleaned.replace(symbol, "")
    })
    cleaned = cleaned.trim()
    return Number.parseFloat(cleaned) || 0
  }

  // Remove English formatting
  const cleaned = input.replace(/[$,]/g, "").trim()
  return Number.parseFloat(cleaned) || 0
}

// Parse percentage input
export function parsePercentage(input: string, language: Language): number {
  if (language === "ar") {
    let cleaned = toWesternDigits(input)
    cleaned = cleaned.replace(/٪/g, "").trim()
    return Number.parseFloat(cleaned) || 0
  }

  const cleaned = input.replace(/%/g, "").trim()
  return Number.parseFloat(cleaned) || 0
}

// Format file size
export function formatFileSize(bytes: number, language: Language): string {
  const units = language === "ar" ? ["بايت", "ك.بايت", "م.بايت", "ج.بايت"] : ["B", "KB", "MB", "GB"]

  if (bytes === 0) return `0 ${units[0]}`

  const k = 1024
  const dm = 2
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const size = Number.parseFloat((bytes / Math.pow(k, i)).toFixed(dm))
  const formattedSize = formatNumber(size, language, { maximumFractionDigits: 2 })

  return `${formattedSize} ${units[i]}`
}

// Format large numbers with abbreviations
export function formatLargeNumber(num: number, language: Language): string {
  const abbreviations = language === "ar" ? ["", "ألف", "مليون", "مليار"] : ["", "K", "M", "B"]

  if (num < 1000) {
    return formatNumber(num, language)
  }

  const tier = (Math.log10(Math.abs(num)) / 3) | 0
  if (tier === 0) return formatNumber(num, language)

  const suffix = abbreviations[tier] || ""
  const scale = Math.pow(10, tier * 3)
  const scaled = num / scale

  const formatted = formatNumber(scaled, language, { maximumFractionDigits: 1 })
  return language === "ar" ? `${formatted} ${suffix}` : `${formatted}${suffix}`
}

// Format duration in hours and minutes with cost calculation
export function formatDurationWithCost(
  minutes: number,
  hourlyRate: number,
  language: Language,
  currencyCode: keyof typeof arabicCurrencySymbols = "USD",
): string {
  const hours = minutes / 60
  const cost = hours * hourlyRate

  const durationText = language === "ar" ? "المدة" : "Duration"
  const costText = language === "ar" ? "التكلفة" : "Cost"

  const formattedDuration = formatDuration(minutes, language)
  const formattedCost = formatCurrency(cost, language, currencyCode)

  return language === "ar"
    ? `${durationText}: ${formattedDuration} - ${costText}: ${formattedCost}`
    : `${durationText}: ${formattedDuration} - ${costText}: ${formattedCost}`
}

// Helper function for duration formatting (from date-utils.ts)
function formatDuration(minutes: number, language: Language): string {
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60

  if (language === "ar") {
    if (hours > 0 && remainingMinutes > 0) {
      return `${toArabicDigits(hours.toString())} ساعة و ${toArabicDigits(remainingMinutes.toString())} دقيقة`
    }
    if (hours > 0) {
      return `${toArabicDigits(hours.toString())} ساعة`
    }
    return `${toArabicDigits(remainingMinutes.toString())} دقيقة`
  }

  // English formatting
  if (hours > 0 && remainingMinutes > 0) {
    return `${hours}h ${remainingMinutes}m`
  }
  if (hours > 0) {
    return `${hours}h`
  }
  return `${remainingMinutes}m`
}

// Format discount or markup
export function formatDiscount(
  originalPrice: number,
  discountedPrice: number,
  language: Language,
  currencyCode: keyof typeof arabicCurrencySymbols = "USD",
): {
  originalPrice: string
  discountedPrice: string
  discountAmount: string
  discountPercentage: string
} {
  const discountAmount = originalPrice - discountedPrice
  const discountPercentage = (discountAmount / originalPrice) * 100

  return {
    originalPrice: formatCurrency(originalPrice, language, currencyCode),
    discountedPrice: formatCurrency(discountedPrice, language, currencyCode),
    discountAmount: formatCurrency(discountAmount, language, currencyCode),
    discountPercentage: formatPercentage(discountPercentage, language),
  }
}

// Format tax calculation
export function formatTaxCalculation(
  baseAmount: number,
  taxRate: number,
  language: Language,
  currencyCode: keyof typeof arabicCurrencySymbols = "USD",
): {
  baseAmount: string
  taxAmount: string
  totalAmount: string
  taxRate: string
} {
  const taxAmount = baseAmount * (taxRate / 100)
  const totalAmount = baseAmount + taxAmount

  return {
    baseAmount: formatCurrency(baseAmount, language, currencyCode),
    taxAmount: formatCurrency(taxAmount, language, currencyCode),
    totalAmount: formatCurrency(totalAmount, language, currencyCode),
    taxRate: formatPercentage(taxRate, language),
  }
}

// Validate currency input
export function validateCurrencyInput(input: string, language: Language): boolean {
  if (language === "ar") {
    // Allow Arabic digits, Arabic separators, and Arabic currency symbols
    const arabicCurrencyPattern = /^[٠-٩،٫\s]*[ر.سد.أيوروج.إد.إج.مد.أد.كر.قد.بر.عل.لد.عل.سد.مد.تد.جد.ل]*$/
    return arabicCurrencyPattern.test(input.trim())
  }

  // Allow English digits, separators, and common currency symbols
  const englishCurrencyPattern = /^[\d,.\s$€£¥]*$/
  return englishCurrencyPattern.test(input.trim())
}

// Validate percentage input
export function validatePercentageInput(input: string, language: Language): boolean {
  if (language === "ar") {
    const arabicPercentagePattern = /^[٠-٩٫\s٪]*$/
    return arabicPercentagePattern.test(input.trim())
  }

  const englishPercentagePattern = /^[\d.\s%]*$/
  return englishPercentagePattern.test(input.trim())
}

// Get currency symbol for display
export function getCurrencySymbol(currencyCode: keyof typeof arabicCurrencySymbols, language: Language): string {
  if (language === "ar") {
    return arabicCurrencySymbols[currencyCode] || currencyConfig.ar.symbol
  }
  return currencyConfig.en.symbol
}

// Format price range
export function formatPriceRange(
  minPrice: number,
  maxPrice: number,
  language: Language,
  currencyCode: keyof typeof arabicCurrencySymbols = "USD",
): string {
  const min = formatCurrency(minPrice, language, currencyCode)
  const max = formatCurrency(maxPrice, language, currencyCode)

  const separator = language === "ar" ? " - " : " - "
  return `${min}${separator}${max}`
}
