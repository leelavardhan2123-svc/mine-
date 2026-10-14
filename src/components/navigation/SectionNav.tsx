import { motion, useScroll } from 'framer-motion'
import { useEffect, useState } from 'react'
import { scrollToSection } from '../../lib/utils'

const SECTIONS = [
  { id: 'top', label: 'Welcome' },
  { id: 'story', label: 'Our Story' },
  { id: 'letter', label: 'The Letter' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'special', label: 'Why You' },
  { id: 'surprise', label: 'Surprise' },
  { id: 'final', label: 'Forever' },
] as const

/** Thin scroll-progress bar + dot navigation (desktop). */
export default function SectionNav() {
  const { scrollYProgress } = useScroll()
  const [active, setActive] = useState('top')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: 0 },
    )

    SECTIONS.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <>
      {/* Scroll progress */}
      <motion.div
        aria-hidden="true"
        style={{ scaleX: scrollYProgress }}
        className="fixed inset-x-0 top-0 z-50 h-1 origin-left bg-gradient-to-r from-love-primary via-rose-400 to-love-accent"
      />

      {/* Dot navigation */}
      <nav
        aria-label="Page sections"
        className="fixed right-5 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-4 lg:flex"
      >
        {SECTIONS.map(({ id, label }) => {
          const isActive = active === id
          return (
            <div key={id} className="group relative flex items-center justify-end">
              <span className="pointer-events-none absolute right-6 whitespace-nowrap rounded-full border border-white/70 bg-white/85 px-3 py-1 font-sans text-[0.68rem] tracking-wide text-love-ink opacity-0 shadow-sm backdrop-blur transition duration-300 group-hover:opacity-100 group-focus-within:opacity-100">
                {label}
              </span>
              <button
                type="button"
                onClick={() => scrollToSection(id)}
                aria-label={`Go to ${label}`}
                aria-current={isActive ? 'true' : undefined}
                className={`rounded-full transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-love-primary ${
                  isActive
                    ? 'h-3.5 w-3.5 bg-love-primary shadow-[0_0_0_4px_color-mix(in_oklab,var(--love-primary)_20%,transparent)]'
                    : 'h-2.5 w-2.5 bg-love-ink/25 hover:bg-love-secondary/70'
                }`}
              />
            </div>
          )
        })}
      </nav>
    </>
  )
}
