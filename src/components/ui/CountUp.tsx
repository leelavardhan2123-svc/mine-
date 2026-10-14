import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useTypewriter'

interface CountUpProps {
  value: number
  duration?: number
}

/** Counts up to a number with an easing curve (instant when reduced motion). */
export default function CountUp({ value, duration = 1600 }: CountUpProps) {
  const reduced = usePrefersReducedMotion()
  const [display, setDisplay] = useState(() => (reduced ? value : 0))

  useEffect(() => {
    if (reduced) {
      const frame = requestAnimationFrame(() => setDisplay(value))
      return () => cancelAnimationFrame(frame)
    }

    let frame = 0
    const start = performance.now()

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(value * eased))
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [value, duration, reduced])

  return <>{display.toLocaleString('en-US')}</>
}
