"use client"

import type React from "react"

import { useState, useEffect, createContext, useContext } from "react"
import { type Language, getCurrentLanguage, setCurrentLanguage } from "@/lib/i18n"

interface LanguageContextType {
  language: Language
  setLanguage: (language: Language) => void
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en")

  useEffect(() => {
    setLanguageState(getCurrentLanguage())
  }, [])

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang)
    setLanguageState(lang)
  }

  return <LanguageContext.Provider value={{ language, setLanguage }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
