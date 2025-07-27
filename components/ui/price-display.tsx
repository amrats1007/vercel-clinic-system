"use client"

import { formatCurrency, formatDiscount, type arabicCurrencySymbols } from "@/lib/number-utils"
import type { Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  originalPrice?: number
  language: Language
  currencyCode?: keyof typeof arabicCurrencySymbols
  size?: "sm" | "md" | "lg"
  showDiscount?: boolean
  className?: string
}

export function PriceDisplay({
  price,
  originalPrice,
  language,
  currencyCode = "USD",
  size = "md",
  showDiscount = true,
  className,
}: PriceDisplayProps) {
  const sizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg font-semibold",
  }

  const hasDiscount = originalPrice && originalPrice > price && showDiscount

  if (hasDiscount) {
    const discountInfo = formatDiscount(originalPrice, price, language, currencyCode)

    return (
      <div className={cn("flex items-center gap-2", language === "ar" && "flex-row-reverse", className)}>
        <span className={cn("text-primary font-semibold", sizeClasses[size])}>{discountInfo.discountedPrice}</span>
        <span className={cn("text-muted-foreground line-through", size === "sm" ? "text-xs" : "text-sm")}>
          {discountInfo.originalPrice}
        </span>
        <span className={cn("text-green-600 font-medium", size === "sm" ? "text-xs" : "text-sm")}>
          -{discountInfo.discountPercentage}
        </span>
      </div>
    )
  }

  return (
    <span className={cn("text-primary font-semibold", sizeClasses[size], className)}>
      {formatCurrency(price, language, currencyCode)}
    </span>
  )
}
