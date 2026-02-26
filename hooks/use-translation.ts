"use client"

import { useState, useEffect, useCallback } from "react"
import { i18n, type Language, type Translation } from "@/lib/i18n"

export function useTranslation() {
  const [, forceUpdate] = useState(0)
  const [language, setLanguageState] = useState<Language>(() => i18n.getLanguage())
  const [translation, setTranslation] = useState<Translation>(() => i18n.getTranslation())

  useEffect(() => {
    // Initialize i18n on mount
    i18n.initialize()

    // Sync state with i18n
    setLanguageState(i18n.getLanguage())
    setTranslation(i18n.getTranslation())

    // Subscribe to language changes
    const unsubscribe = i18n.subscribe((newLanguage) => {
      setLanguageState(newLanguage)
      setTranslation(i18n.getTranslation())
      forceUpdate((n) => n + 1) // Force re-render for all components
    })

    return unsubscribe
  }, [])

  const t = useCallback(
    (key: keyof Translation): string => {
      return translation[key] || key
    },
    [translation],
  )

  const setLanguage = useCallback((lang: Language) => {
    i18n.setLanguage(lang)
  }, [])

  return {
    language,
    translation,
    t,
    setLanguage,
  }
}
