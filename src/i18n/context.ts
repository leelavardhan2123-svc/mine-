import { createContext } from 'react'
import type { MessageKey } from './en.ts'

export type Lang = 'en' | 'te'

export type I18nValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: MessageKey, vars?: Record<string, string | number>) => string
  pick: <T extends { en: string; te?: string }>(
    value: T | undefined,
    fallback?: string,
  ) => string
  hasTe: boolean
}

export const I18nContext = createContext<I18nValue | null>(null)
