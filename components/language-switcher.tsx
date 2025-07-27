"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Globe } from "lucide-react"
import { languages, type Language, getCurrentLanguage, setCurrentLanguage } from "@/lib/i18n"
import { useState, useEffect } from "react"

export function LanguageSwitcher() {
  const [currentLang, setCurrentLang] = useState<Language>("en")

  useEffect(() => {
    setCurrentLang(getCurrentLanguage())
  }, [])

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language)
    setCurrentLang(language)
    // Force a page refresh to apply language changes
    window.location.reload()
  }

  return (
    <Select value={currentLang} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-auto gap-2 border-none bg-transparent">
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{languages[currentLang]}</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(languages).map(([code, name]) => (
          <SelectItem key={code} value={code}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
