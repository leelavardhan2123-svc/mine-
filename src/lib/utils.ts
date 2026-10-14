import type { CSSProperties } from 'react'

/**
 * Builds a React style object that may contain CSS custom properties
 * (e.g. `{ '--dur': '18s' }`), which plain object literals cannot express.
 */
export function styleWithVars(
  base: CSSProperties = {},
  vars: Record<string, string | number> = {},
): CSSProperties {
  return Object.assign({}, base, vars)
}

/** Resolves a public/ asset path against Vite's base URL. */
export function assetUrl(path: string): string {
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
}

/** Smoothly scrolls to a section id (respects reduced motion). */
export function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (!element) return
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  element.scrollIntoView({
    behavior: reduced ? 'auto' : 'smooth',
    block: 'start',
  })
}

/** Whole days elapsed since a YYYY-MM-DD date (never negative). */
export function daysSince(dateString: string): number {
  const target = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(target.getTime())) return 0
  const now = new Date()
  const diff = now.getTime() - target.getTime()
  return Math.max(0, Math.floor(diff / 86_400_000))
}

/** Formats a date for display — tolerant of non-ISO input. */
export function formatDate(dateString: string): string {
  const target = new Date(`${dateString}T00:00:00`)
  if (Number.isNaN(target.getTime())) return dateString
  return target.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}
