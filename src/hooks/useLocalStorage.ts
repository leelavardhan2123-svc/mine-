import { useCallback, useEffect, useState } from 'react'

/**
 * Reads and writes values in localStorage, safely.
 * If storage is unavailable (private mode, blocked cookies) the app
 * still works — it simply remembers nothing.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw !== null ? (JSON.parse(raw) as T) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* storage unavailable — ignore */
    }
  }, [key, value])

  const reset = useCallback(() => setValue(initialValue), [initialValue])

  return [value, setValue, reset] as const
}

/** Clears every preference this app has saved for the current visitor. */
export function clearLoveStoryStorage() {
  try {
    const prefix = 'forever-with-you:'
    const keys: string[] = []
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i)
      if (k && k.startsWith(prefix)) keys.push(k)
    }
    keys.forEach((k) => window.localStorage.removeItem(k))
  } catch {
    /* ignore */
  }
}
