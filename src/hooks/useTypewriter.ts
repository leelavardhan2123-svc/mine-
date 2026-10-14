import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface TypewriterOptions {
  /** Start revealing immediately */
  start?: boolean
  /** Milliseconds per character */
  speed?: number
  onDone?: () => void
}

/**
 * Reveals a string character by character, like a typewriter.
 * Honours prefers-reduced-motion by showing the full text at once.
 *
 * `skip()` jumps to the end, `replay()` types it out again — both are
 * meant to be called from event handlers.
 */
export function useTypewriter(text: string, options: TypewriterOptions = {}) {
  const { start = true, speed = 16, onDone } = options
  const reducedMotion = usePrefersReducedMotion()
  const [count, setCount] = useState(() => (reducedMotion ? text.length : 0))
  const [generation, setGeneration] = useState(0)

  const doneRef = useRef(false)
  const skippedRef = useRef(false)
  // Latest callback kept in a ref so an inline arrow never restarts typing.
  const onDoneRef = useRef(onDone)

  useEffect(() => {
    onDoneRef.current = onDone
  }, [onDone])

  const finish = useCallback(() => {
    if (doneRef.current) return
    doneRef.current = true
    onDoneRef.current?.()
  }, [])

  const skip = useCallback(() => {
    skippedRef.current = true
    setCount(text.length)
    finish()
  }, [text, finish])

  const replay = useCallback(() => {
    skippedRef.current = false
    doneRef.current = false
    setCount(0)
    setGeneration((value) => value + 1)
  }, [])

  useEffect(() => {
    if (!start) return

    if (reducedMotion) {
      const frame = requestAnimationFrame(() => {
        skippedRef.current = true
        setCount(text.length)
        finish()
      })
      return () => cancelAnimationFrame(frame)
    }

    if (count >= text.length) {
      finish()
      return
    }

    let index = count
    const id = window.setInterval(() => {
      if (skippedRef.current) {
        window.clearInterval(id)
        return
      }
      index += 1
      if (index >= text.length) {
        setCount(text.length)
        window.clearInterval(id)
        finish()
        return
      }
      setCount(index)
    }, speed)

    return () => window.clearInterval(id)
    // `count` is intentionally read once per run: it is the starting
    // position, not something the interval should react to.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, text, speed, reducedMotion, generation, finish])

  const displayed = useMemo(() => text.slice(0, count), [text, count])
  const isDone = count >= text.length

  return { displayed, isDone, skip, replay }
}

/** Subscribes to the OS "reduce motion" preference. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })

  useEffect(() => {
    if (!window.matchMedia) return
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = (event: MediaQueryListEvent) => setReduced(event.matches)
    query.addEventListener('change', onChange)
    return () => query.removeEventListener('change', onChange)
  }, [])

  return reduced
}
