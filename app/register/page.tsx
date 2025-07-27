"use client"

import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

export default function RegisterPage() {
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Back to Home */}
        <Link href="/">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t("common.back")}
          </Button>
        </Link>

        {/* Staff Account Info Alert */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4" />
          <AlertDescription className="text-sm">
            <strong>Staff Account Information:</strong> Staff accounts (doctors, secretaries, etc.) are created by
            clinic administrators. If you are a healthcare professional, please contact your clinic administrator.
          </AlertDescription>
        </Alert>

        {/* Registration Card */}
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">{t("auth.register.title")}</CardTitle>
            <CardDescription>{t("auth.register.subtitle")}</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {t("auth.hasAccount")}{" "}
                <Link href="/login" className="text-blue-600 hover:underline font-medium">
                  {t("auth.signIn")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
