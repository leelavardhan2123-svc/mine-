import { useContext } from 'react'
import { I18nContext } from './context.ts'
import type { I18nValue } from './context.ts'

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside I18nProvider')
  return ctx
}
