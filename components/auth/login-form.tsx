"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Eye, EyeOff } from "lucide-react"
import { type Language, getTranslation } from "@/lib/i18n"
import Link from "next/link"

interface LoginFormProps {
  language: Language
}

export function LoginForm({ language }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const router = useRouter()
  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        // Use the redirect path from the API response
        router.push(data.redirectPath)
      } else {
        setError(data.error || t("incorrectCredentials"))
      }
    } catch (error) {
      setError(t("errorOccurred"))
    } finally {
      setIsLoading(false)
    }
  }

  // Demo credentials helper
  const demoCredentials = [
    { role: "Super Admin", email: "admin@system.com", password: "password" },
    { role: "Clinic Admin (City Medical)", email: "admin@citymedical.com", password: "password" },
    { role: "Clinic Admin (Family Health)", email: "admin@familyhealth.com", password: "password" },
    { role: "Doctor (General Medicine)", email: "dr.omar@citymedical.com", password: "password" },
    { role: "Doctor (Pediatrics)", email: "dr.sara@citymedical.com", password: "password" },
    { role: "Secretary (City Medical)", email: "secretary@citymedical.com", password: "password" },
    { role: "Purchasing Staff", email: "purchasing@citymedical.com", password: "password" },
    { role: "Patient", email: "patient1@email.com", password: "password" },
  ]

  const fillDemoCredentials = (email: string, password: string) => {
    setEmail(email)
    setPassword(password)
  }

  return (
    <div className="space-y-6">
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
            required
            disabled={isLoading}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
              className="pr-10 rtl:pr-3 rtl:pl-10"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent rtl:right-auto rtl:left-0"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4 text-gray-400" /> : <Eye className="h-4 w-4 text-gray-400" />}
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <Link href="/forgot-password" className="text-blue-600 hover:underline">
              {t("forgotPassword")}
            </Link>
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin rtl:mr-0 rtl:ml-2" />}
          {t("loginButton")}
        </Button>
      </form>

      {/* Demo Credentials Section */}
      <div className="border-t pt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Demo Login Credentials:</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {demoCredentials.map((cred, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
              <div>
                <div className="font-medium">{cred.role}</div>
                <div className="text-gray-600">{cred.email}</div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
                className="text-xs px-2 py-1"
              >
                Use
              </Button>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          All demo accounts use password: <code className="bg-gray-100 px-1 rounded">password</code>
        </p>
      </div>
    </div>
  )
}
