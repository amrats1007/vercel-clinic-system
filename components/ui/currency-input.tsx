"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCurrency, parseCurrency, validateCurrencyInput, getCurrencySymbol } from "@/lib/number-utils"
import type { arabicCurrencySymbols } from "@/lib/number-utils"
import type { Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface CurrencyInputProps {
  value?: number
  onChange?: (value: number) => void
  language: Language
  currencyCode?: keyof typeof arabicCurrencySymbols
  label?: string
  placeholder?: string
  disabled?: boolean
  className?: string
  error?: string
  required?: boolean
}

export function CurrencyInput({
  value = 0,
  onChange,
  language,
  currencyCode = "USD",
  label,
  placeholder,
  disabled = false,
  className,
  error,
  required = false,
}: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState("")
  const [isFocused, setIsFocused] = React.useState(false)

  // Update display value when value prop changes
  React.useEffect(() => {
    if (!isFocused) {
      setDisplayValue(value > 0 ? formatCurrency(value, language, currencyCode, { showSymbol: false }) : "")
    }
  }, [value, language, currencyCode, isFocused])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    setDisplayValue(inputValue)

    // Validate input
    if (validateCurrencyInput(inputValue, language)) {
      const numericValue = parseCurrency(inputValue, language)
      onChange?.(numericValue)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Show raw number when focused
    if (value > 0) {
      setDisplayValue(value.toString())
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Format display value when not focused
    if (value > 0) {
      setDisplayValue(formatCurrency(value, language, currencyCode, { showSymbol: false }))
    }
  }

  const currencySymbol = getCurrencySymbol(currencyCode, language)
  const isRTL = language === "ar"

  return (
    <div className="space-y-2">
      {label && (
        <Label className={cn(error && "text-destructive")}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      <div className="relative">
        {/* Currency symbol */}
        <div
          className={cn(
            "absolute top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none z-10",
            isRTL ? "left-3" : "right-3",
          )}
        >
          {currencySymbol}
        </div>
        <Input
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            isRTL ? "text-right pr-16" : "text-left pl-16",
            error && "border-destructive focus-visible:ring-destructive",
            className,
          )}
          dir={isRTL ? "rtl" : "ltr"}
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
