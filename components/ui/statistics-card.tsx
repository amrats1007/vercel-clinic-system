"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatNumber, formatCurrency, formatPercentage, type arabicCurrencySymbols } from "@/lib/number-utils"
import type { Language } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

interface StatisticsCardProps {
  title: string
  value: number
  type: "number" | "currency" | "percentage"
  language: Language
  currencyCode?: keyof typeof arabicCurrencySymbols
  previousValue?: number
  showTrend?: boolean
  icon?: React.ReactNode
  className?: string
}

export function StatisticsCard({
  title,
  value,
  type,
  language,
  currencyCode = "USD",
  previousValue,
  showTrend = true,
  icon,
  className,
}: StatisticsCardProps) {
  const formatValue = () => {
    switch (type) {
      case "currency":
        return formatCurrency(value, language, currencyCode)
      case "percentage":
        return formatPercentage(value, language)
      default:
        return formatNumber(value, language)
    }
  }

  const getTrendInfo = () => {
    if (!previousValue || !showTrend) return null

    const change = value - previousValue
    const changePercentage = (change / previousValue) * 100

    const isPositive = change > 0
    const isNegative = change < 0

    const trendIcon = isPositive ? (
      <TrendingUp className="w-4 h-4" />
    ) : isNegative ? (
      <TrendingDown className="w-4 h-4" />
    ) : (
      <Minus className="w-4 h-4" />
    )

    const trendColor = isPositive ? "text-green-600" : isNegative ? "text-red-600" : "text-gray-500"

    return (
      <div className={cn("flex items-center gap-1 text-sm", trendColor, language === "ar" && "flex-row-reverse")}>
        {trendIcon}
        <span>{formatPercentage(Math.abs(changePercentage), language)}</span>
      </div>
    )
  }

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className={cn("flex items-end justify-between", language === "ar" && "flex-row-reverse")}>
          <div className="text-2xl font-bold">{formatValue()}</div>
          {getTrendInfo()}
        </div>
      </CardContent>
    </Card>
  )
}
