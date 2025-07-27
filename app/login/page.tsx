"use client"

import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LanguageSwitcher } from "@/components/language-switcher"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"
import Link from "next/link"

export default function LoginPage() {
  const { language, setLanguage } = useLanguage()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-4 right-4 rtl:right-auto rtl:left-4">
        <LanguageSwitcher currentLang={language} onLanguageChange={setLanguage} />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t("welcomeBack")}</CardTitle>
          <CardDescription>{t("signInAccount")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm language={language} />
          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">{t("dontHaveAccount")} </span>
            <Link href="/register" className="text-blue-600 hover:underline">
              {t("signUp")}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
