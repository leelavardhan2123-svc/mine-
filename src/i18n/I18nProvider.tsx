import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { en } from './en.ts'
import type { MessageKey, Messages } from './en.ts'
import { te } from './te.ts'
import { I18nContext } from './context.ts'
import type { I18nValue, Lang } from './context.ts'

const STORAGE_KEY = 'sahayak:lang'

const DICTS: Record<Lang, Partial<Messages>> = { en, te }

function readStoredLang(): Lang {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'te') return stored
  } catch {
    /* storage unavailable */
  }
  return 'en'
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readStoredLang())

  useEffect(() => {
    document.documentElement.lang = lang === 'te' ? 'te' : 'en'
    document.body.dataset.lang = lang
    try {
      window.localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      /* storage unavailable */
    }
  }, [lang])

  const setLang = useCallback((next: Lang) => setLangState(next), [])

  const t = useCallback(
    (key: MessageKey, vars?: Record<string, string | number>) => {
      const raw = DICTS[lang][key] ?? en[key] ?? key
      if (!vars) return raw
      return raw.replace(/\{(\w+)\}/g, (match, name: string) =>
        vars[name] !== undefined ? String(vars[name]) : match,
      )
    },
    [lang],
  )

  const pick = useCallback(
    <T extends { en: string; te?: string }>(value: T | undefined, fallback = '') => {
      if (!value) return fallback
      if (lang === 'te' && value.te) return value.te
      return value.en
    },
    [lang],
  )

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, t, pick, hasTe: lang === 'te' }),
    [lang, setLang, t, pick],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export type { MessageKey, Lang }
