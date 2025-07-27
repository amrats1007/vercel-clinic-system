"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useLanguage } from "@/hooks/use-language"
import { getTranslation } from "@/lib/i18n"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
  confirmPassword: string
  dateOfBirth: string
  gender: string
  address: string
}

interface FormErrors {
  [key: string]: string
}

export function RegisterForm() {
  const router = useRouter()
  const { language } = useLanguage()
  const t = (key: string) => getTranslation(key, language)

  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    address: "",
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [serverError, setServerError] = useState("")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Required field validation
    if (!formData.firstName.trim()) newErrors.firstName = t("validation.required")
    if (!formData.lastName.trim()) newErrors.lastName = t("validation.required")
    if (!formData.email.trim()) newErrors.email = t("validation.required")
    if (!formData.phone.trim()) newErrors.phone = t("validation.required")
    if (!formData.password) newErrors.password = t("validation.required")
    if (!formData.confirmPassword) newErrors.confirmPassword = t("validation.required")
    if (!formData.dateOfBirth) newErrors.dateOfBirth = t("validation.required")
    if (!formData.gender) newErrors.gender = t("validation.required")
    if (!formData.address.trim()) newErrors.address = t("validation.required")

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("validation.email")
    }

    // Password validation
    if (formData.password && formData.password.length < 8) {
      newErrors.password = t("validation.password.min")
    }

    // Password confirmation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("validation.password.match")
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
    setServerError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    setServerError("")

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          role: "patient", // Always patient for public registration
        }),
      })

      let data
      const contentType = response.headers.get("content-type")

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        // Handle non-JSON responses (like HTML error pages)
        const text = await response.text()
        throw new Error(`Server returned non-JSON response: ${text.substring(0, 100)}...`)
      }

      if (response.ok && data.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        setServerError(data.error || "Registration failed. Please try again.")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setServerError(
        error instanceof Error ? error.message : "Network error. Please check your connection and try again.",
      )
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">{t("register.success")}</AlertDescription>
      </Alert>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {serverError && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{serverError}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("register.form.firstName")}</Label>
          <Input
            id="firstName"
            type="text"
            value={formData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            disabled={isLoading}
            className={errors.firstName ? "border-red-500" : ""}
          />
          {errors.firstName && <p className="text-sm text-red-600">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">{t("register.form.lastName")}</Label>
          <Input
            id="lastName"
            type="text"
            value={formData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            disabled={isLoading}
            className={errors.lastName ? "border-red-500" : ""}
          />
          {errors.lastName && <p className="text-sm text-red-600">{errors.lastName}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("register.form.email")}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={isLoading}
          className={errors.email ? "border-red-500" : ""}
        />
        {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t("register.form.phone")}</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          disabled={isLoading}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && <p className="text-sm text-red-600">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">{t("register.form.dateOfBirth")}</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            disabled={isLoading}
            className={errors.dateOfBirth ? "border-red-500" : ""}
          />
          {errors.dateOfBirth && <p className="text-sm text-red-600">{errors.dateOfBirth}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">{t("register.form.gender")}</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
            <SelectTrigger className={errors.gender ? "border-red-500" : ""}>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">{t("register.form.gender.male")}</SelectItem>
              <SelectItem value="female">{t("register.form.gender.female")}</SelectItem>
            </SelectContent>
          </Select>
          {errors.gender && <p className="text-sm text-red-600">{errors.gender}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">{t("register.form.address")}</Label>
        <Input
          id="address"
          type="text"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          disabled={isLoading}
          className={errors.address ? "border-red-500" : ""}
        />
        {errors.address && <p className="text-sm text-red-600">{errors.address}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("register.form.password")}</Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) => handleInputChange("password", e.target.value)}
          disabled={isLoading}
          className={errors.password ? "border-red-500" : ""}
        />
        {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("register.form.confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
          disabled={isLoading}
          className={errors.confirmPassword ? "border-red-500" : ""}
        />
        {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("register.form.submitting")}
          </>
        ) : (
          t("register.form.submit")
        )}
      </Button>
    </form>
  )
}
