import { createContext } from 'react'
import type { MessageKey } from './en.ts'

export const LANGS = ['en', 'hi', 'te', 'ta', 'bn', 'mr', 'gu', 'kn', 'ml', 'pa', 'or'] as const

export type Lang = (typeof LANGS)[number]

export function isLang(value: string | null): value is Lang {
  return Boolean(value && (LANGS as readonly string[]).includes(value))
}

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
