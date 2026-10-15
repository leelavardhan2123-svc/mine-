import { useCallback, useEffect, useState } from 'react'

export type ParsedHash = {
  path: string
  segments: string[]
  query: URLSearchParams
}

function parseHash(): ParsedHash {
  const raw = window.location.hash.replace(/^#\/?/, '')
  const [pathPart = '', queryPart = ''] = raw.split('?')
  const clean = pathPart.replace(/\/+$/, '')
  const path = clean === '' ? '/' : `/${clean}`
  const segments = path.split('/').filter(Boolean)
  return { path, segments, query: new URLSearchParams(queryPart) }
}

export function useHashRoute(): ParsedHash {
  const [route, setRoute] = useState<ParsedHash>(() => parseHash())

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export function navigate(to: string): void {
  const next = to.startsWith('/') ? to : `/${to}`
  if (window.location.hash === `#${next}`) return
  window.location.hash = next
  window.scrollTo({ top: 0, behavior: 'auto' })
}

export function goBack(fallback = '/'): void {
  if (window.history.length > 1) window.history.back()
  else navigate(fallback)
}

export function useNavigate() {
  return useCallback((to: string) => navigate(to), [])
}
