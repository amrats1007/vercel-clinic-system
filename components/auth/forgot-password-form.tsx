"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, Mail } from "lucide-react"
import { type Language, getTranslation } from "@/lib/i18n"

interface ForgotPasswordFormProps {
  language: Language
}

export function ForgotPasswordForm({ language }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
      } else {
        setError(data.error || t("errorOccurred"))
      }
    } catch (error) {
      setError(t("errorOccurred"))
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-green-700">{t("emailSent")}</h3>
          <p className="text-sm text-gray-600">{t("checkEmailInstructions")}</p>
        </div>
        <Alert>
          <Mail className="h-4 w-4" />
          <AlertDescription>
            {t("emailSentTo")} <strong>{email}</strong>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="email">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t("enterEmailAddress")}
          required
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:mr-0 rtl:ml-2" />}
        {t("sendResetLink")}
      </Button>

      <div className="text-xs text-gray-500 text-center">{t("resetPasswordNote")}</div>
    </form>
  )
}
