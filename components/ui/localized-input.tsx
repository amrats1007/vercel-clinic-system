"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { parseArabicInput, toArabicDigits } from "@/lib/date-utils"
import type { Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface LocalizedInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  language: Language
  convertDigits?: boolean
}

export const LocalizedInput = React.forwardRef<HTMLInputElement, LocalizedInputProps>(
  ({ language, convertDigits = true, onChange, value, className, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(value?.toString() || "")

    React.useEffect(() => {
      if (value !== undefined) {
        const stringValue = value.toString()
        setDisplayValue(language === "ar" && convertDigits ? toArabicDigits(stringValue) : stringValue)
      }
    }, [value, language, convertDigits])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      setDisplayValue(inputValue)

      if (onChange) {
        // Convert Arabic digits to Western digits for processing
        const processedValue = language === "ar" && convertDigits ? parseArabicInput(inputValue) : inputValue
        const newEvent = {
          ...e,
          target: {
            ...e.target,
            value: processedValue,
          },
        }
        onChange(newEvent)
      }
    }

    return (
      <Input
        {...props}
        ref={ref}
        value={displayValue}
        onChange={handleChange}
        className={cn(language === "ar" && "text-right", className)}
        dir={language === "ar" ? "rtl" : "ltr"}
      />
    )
  },
)

LocalizedInput.displayName = "LocalizedInput"
