import { useEffect, useState } from 'react'

export function useOnline(): boolean {
  const [online, setOnline] = useState(() =>
    typeof navigator === 'undefined' ? true : navigator.onLine,
  )
  useEffect(() => {
    const goOnline = () => setOnline(true)
    const goOffline = () => setOnline(false)
    window.addEventListener('online', goOnline)
    window.addEventListener('offline', goOffline)
    return () => {
      window.removeEventListener('online', goOnline)
      window.removeEventListener('offline', goOffline)
    }
  }, [])
  return online
}

const INCLUSIVE_KEY = 'sahayak:inclusive'

export function useInclusiveMode(): [boolean, (value: boolean) => void] {
  const [enabled, setEnabled] = useState(() => {
    try {
      return window.localStorage.getItem(INCLUSIVE_KEY) === 'on'
    } catch {
      return false
    }
  })

  useEffect(() => {
    document.documentElement.dataset.inclusive = enabled ? 'on' : 'off'
    try {
      window.localStorage.setItem(INCLUSIVE_KEY, enabled ? 'on' : 'off')
    } catch {
      /* storage unavailable */
    }
  }, [enabled])

  return [enabled, setEnabled]
}
