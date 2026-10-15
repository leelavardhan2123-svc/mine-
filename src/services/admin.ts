import { readJSON, writeJSON } from './storage.ts'

export type SchemeOverlay = {
  verification?: 'verified' | 'needs-reverification' | 'incomplete' | 'archived'
  lastVerified?: string
  publication?: 'published' | 'draft' | 'archived'
  benefits?: { en: string; te?: string }
  benefitsVerified?: boolean
  knownUncertainty?: { en: string; te?: string }
  verificationNote?: { en: string; te?: string }
}

export type AdminOverlay = Record<string, SchemeOverlay>

export function readOverlay(): AdminOverlay {
  return readJSON<AdminOverlay>('admin-overlay', {})
}

export function writeOverlay(overlay: AdminOverlay): void {
  writeJSON('admin-overlay', overlay)
}

export function overlayActive(): boolean {
  return Object.keys(readOverlay()).length > 0
}

export function applyOverlay<T extends { id: string }>(
  schemes: T[],
  overlay: AdminOverlay,
): T[] {
  return schemes.map((scheme) => {
    const patch = overlay[scheme.id]
    return patch ? ({ ...scheme, ...patch } as T) : scheme
  })
}

export function adminTokenConfigured(): boolean {
  const token = import.meta.env.VITE_ADMIN_TOKEN
  return typeof token === 'string' && token.length >= 8
}

export function adminTokenMatches(candidate: string): boolean {
  const token = import.meta.env.VITE_ADMIN_TOKEN
  if (typeof token !== 'string' || token.length === 0) return false
  return candidate.trim() === token.trim()
}
