import { siteConfig } from '../config/site'
import type { SiteConfig } from '../config/site'

/** Applies the colours from src/config/site.ts as CSS variables. */
export function applyTheme(config: SiteConfig = siteConfig) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  const entries = Object.entries(config.colors) as [
    keyof SiteConfig['colors'],
    string,
  ][]

  for (const [name, value] of entries) {
    root.style.setProperty(`--love-${name}`, value)
  }
}
