"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CurrencyInput } from "@/components/ui/currency-input"
import { PercentageInput } from "@/components/ui/percentage-input"
import { Separator } from "@/components/ui/separator"
import { formatTaxCalculation, type arabicCurrencySymbols, formatCurrency } from "@/lib/number-utils"
import { PriceDisplay } from "@/components/ui/price-display"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export function PricingCalculator() {
  const { language } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  const [baseAmount, setBaseAmount] = useState(150)
  const [taxRate, setTaxRate] = useState(15)
  const [discountRate, setDiscountRate] = useState(0)
  const [currencyCode, setCurrencyCode] = useState<keyof typeof arabicCurrencySymbols>("USD")

  const discountAmount = baseAmount * (discountRate / 100)
  const discountedAmount = baseAmount - discountAmount
  const taxCalculation = formatTaxCalculation(discountedAmount, taxRate, language, currencyCode)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>
          {t("consultationFee")} {t("calculator")}
        </CardTitle>
        <CardDescription>Calculate total cost with tax and discounts</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <CurrencyInput
          label={t("baseAmount")}
          value={baseAmount}
          onChange={setBaseAmount}
          language={language}
          currencyCode={currencyCode}
          required
        />

        <PercentageInput
          label={t("discountRate")}
          value={discountRate}
          onChange={setDiscountRate}
          language={language}
          max={50}
        />

        <PercentageInput label={t("taxRate")} value={taxRate} onChange={setTaxRate} language={language} required />

        <Separator />

        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">{t("baseAmount")}:</span>
            <PriceDisplay price={baseAmount} language={language} currencyCode={currencyCode} size="sm" />
          </div>

          {discountRate > 0 && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {t("discount")} ({discountRate}%):
                </span>
                <span className="text-sm text-red-600">-{formatCurrency(discountAmount, language, currencyCode)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{t("subtotal")}:</span>
                <PriceDisplay price={discountedAmount} language={language} currencyCode={currencyCode} size="sm" />
              </div>
            </>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">
              {t("tax")} ({taxRate}%):
            </span>
            <span className="text-sm text-gray-600">{taxCalculation.taxAmount}</span>
          </div>

          <Separator />

          <div className="flex justify-between items-center">
            <span className="font-semibold">{t("totalAmount")}:</span>
            <PriceDisplay
              price={Number.parseFloat(taxCalculation.totalAmount.replace(/[^\d.-]/g, ""))}
              language={language}
              currencyCode={currencyCode}
              size="lg"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
