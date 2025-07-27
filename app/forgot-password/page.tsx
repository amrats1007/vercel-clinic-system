"use client"

import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function ForgotPasswordPage() {
  const { language, setLanguage } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
        <LanguageSwitcher currentLang={language} onLanguageChange={setLanguage} />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("forgotPassword")}</CardTitle>
          <CardDescription>{t("forgotPasswordDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <ForgotPasswordForm language={language} />
          <div className="mt-6 text-center">
            <Link href="/login" className="inline-flex items-center text-sm text-blue-600 hover:underline">
              <ArrowLeft className="mr-2 h-4 w-4 rtl:mr-0 rtl:ml-2 rtl:rotate-180" />
              {t("backToLogin")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
