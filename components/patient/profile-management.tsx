"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Avatar, AvatarFallback, AvatarInitials } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Loader2, Edit, Save, X, MapPin } from "lucide-react"
import { getTranslation } from "@/lib/i18n"
import { useLanguage } from "@/hooks/use-language"
import type { AuthUser } from "@/lib/auth"

interface ProfileData extends AuthUser {
  dateOfBirth?: string
  address?: string
  emergencyContact?: string
  medicalHistory?: string
  allergies?: string
  createdAt?: string
}

interface ProfileManagementProps {
  user: AuthUser
}

export function ProfileManagement({ user }: ProfileManagementProps) {
  const { language } = useLanguage()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [profileData, setProfileData] = useState<ProfileData>(user)

  const t = (key: keyof typeof import("@/lib/i18n").translations.en) => getTranslation(language, key)

  // Load full profile data
  useEffect(() => {
    const loadProfile = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/profile/${user.id}`)
        if (response.ok) {
          const data = await response.json()
          setProfileData(data)
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [user.id])

  const handleSave = async () => {
    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const response = await fetch(`/api/profile/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: profileData.firstName,
          lastName: profileData.lastName,
          email: profileData.email,
          phone: profileData.phone,
          dateOfBirth: profileData.dateOfBirth,
          address: profileData.address,
          emergencyContact: profileData.emergencyContact,
          medicalHistory: profileData.medicalHistory,
          allergies: profileData.allergies,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(t("profileUpdated"))
        setIsEditing(false)
        setProfileData(data)
      } else {
        setError(data.error || t("errorOccurred"))
      }
    } catch (error) {
      setError(t("errorOccurred"))
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setProfileData(user)
    setIsEditing(false)
    setError("")
    setSuccess("")
  }

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6" dir={language === "ar" ? "rtl" : "ltr"}>
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <Avatar className="h-16 w-16">
                <AvatarFallback>
                  <AvatarInitials name={`${profileData.firstName} ${profileData.lastName}`} />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">
                  {profileData.firstName} {profileData.lastName}
                </CardTitle>
                <CardDescription className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Badge variant="secondary">{t("patient")}</Badge>
                  {profileData.createdAt && (
                    <span className="text-sm text-muted-foreground">
                      {t("memberSince")} {new Date(profileData.createdAt).getFullYear()}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex space-x-2 rtl:space-x-reverse">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                  {t("editProfile")}
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("cancel")}
                  </Button>
                  <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving && <Loader2 className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2 animate-spin" />}
                    <Save className="h-4 w-4 mr-2 rtl:mr-0 rtl:ml-2" />
                    {t("saveChanges")}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Alerts */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="h-5 w-5 mr-2 rtl:mr-0 rtl:ml-2" />
            {t("personalInformation")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t("firstName")}</Label>
              {isEditing ? (
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className={language === "ar" ? "text-right" : ""}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{profileData.firstName}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">{t("lastName")}</Label>
              {isEditing ? (
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className={language === "ar" ? "text-right" : ""}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{profileData.lastName}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {t("email")}
              </Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  className={language === "ar" ? "text-right" : ""}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{profileData.email}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {t("phone")}
              </Label>
              {isEditing ? (
                <Input
                  id="phone"
                  type="tel"
                  value={profileData.phone || ""}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  className={language === "ar" ? "text-right" : ""}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{profileData.phone || t("notProvided")}</div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateOfBirth" className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {t("dateOfBirth")}
              </Label>
              {isEditing ? (
                <Input
                  id="dateOfBirth"
                  type="date"
                  value={profileData.dateOfBirth || ""}
                  onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">
                  {profileData.dateOfBirth
                    ? new Date(profileData.dateOfBirth).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US")
                    : t("notProvided")}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="flex items-center">
                <MapPin className="h-4 w-4 mr-1 rtl:mr-0 rtl:ml-1" />
                {t("address")}
              </Label>
              {isEditing ? (
                <Input
                  id="address"
                  value={profileData.address || ""}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  className={language === "ar" ? "text-right" : ""}
                />
              ) : (
                <div className="p-2 bg-muted rounded-md">{profileData.address || t("notProvided")}</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card>
        <CardHeader>
          <CardTitle>{t("emergencyContact")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="emergencyContact">{t("emergencyContactInfo")}</Label>
            {isEditing ? (
              <Input
                id="emergencyContact"
                value={profileData.emergencyContact || ""}
                onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                placeholder={t("emergencyContactPlaceholder")}
                className={language === "ar" ? "text-right" : ""}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md">{profileData.emergencyContact || t("notProvided")}</div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Medical Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t("medicalInformation")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="allergies">{t("allergies")}</Label>
            {isEditing ? (
              <textarea
                id="allergies"
                value={profileData.allergies || ""}
                onChange={(e) => handleInputChange("allergies", e.target.value)}
                placeholder={t("allergiesPlaceholder")}
                className={`w-full p-2 border rounded-md resize-none h-20 ${language === "ar" ? "text-right" : ""}`}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md min-h-[80px]">{profileData.allergies || t("notProvided")}</div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="medicalHistory">{t("medicalHistory")}</Label>
            {isEditing ? (
              <textarea
                id="medicalHistory"
                value={profileData.medicalHistory || ""}
                onChange={(e) => handleInputChange("medicalHistory", e.target.value)}
                placeholder={t("medicalHistoryPlaceholder")}
                className={`w-full p-2 border rounded-md resize-none h-32 ${language === "ar" ? "text-right" : ""}`}
                dir={language === "ar" ? "rtl" : "ltr"}
              />
            ) : (
              <div className="p-2 bg-muted rounded-md min-h-[128px]">
                {profileData.medicalHistory || t("notProvided")}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
