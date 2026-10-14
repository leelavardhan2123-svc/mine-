import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useState } from 'react'
import { siteConfig } from '../../config/site'

interface WelcomeScreenProps {
  onOpen: () => void
}

interface Burst {
  id: number
  x: number
  y: number
  size: number
  delay: number
  emoji: string
}

const EMOJIS = ['❤️', '💕', '💗', '✨', '💌', '💖', '🌹', '✨']

function createBurst(id: number): Burst[] {
  return Array.from({ length: 22 }, (_, i) => {
    const angle = (i / 22) * Math.PI * 2
    const distance = 120 + (i % 5) * 34
    return {
      id: id * 100 + i,
      x: Math.cos(angle) * distance,
      y: Math.sin(angle) * distance,
      size: 16 + (i % 4) * 6,
      delay: (i % 6) * 0.03,
      emoji: EMOJIS[i % EMOJIS.length],
    }
  })
}

/**
 * FEATURE 1 — the immersive opening screen. Clicking the button sends a
 * burst of hearts across the screen, then the main experience fades in.
 */
export default function WelcomeScreen({ onOpen }: WelcomeScreenProps) {
  const { welcome } = siteConfig
  const [burst, setBurst] = useState<Burst[]>([])
  const openingRef = useRef(false)

  const handleOpen = () => {
    if (openingRef.current) return
    openingRef.current = true
    setBurst(createBurst(1))
    window.setTimeout(onOpen, 620)
  }

  return (
    <    motion.section
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
      transition={{ duration: 0.55, ease: 'easeInOut' }}
      className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden px-6 text-center"
      aria-label="Welcome"
    >
      {/* Soft halo behind the message */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute h-[26rem] w-[26rem] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(circle, color-mix(in oklab, var(--love-secondary) 35%, transparent), transparent 70%)',
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
        className="relative z-10 flex max-w-3xl flex-col items-center gap-6"
      >
        <motion.span
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="inline-flex items-center gap-2 rounded-full border border-love-primary/20 bg-white/60 px-5 py-1.5 font-sans text-[0.68rem] font-medium uppercase tracking-[0.4em] text-love-primary backdrop-blur-md"
        >
          {welcome.eyebrow}
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.45, ease: 'easeOut' }}
          className="font-script text-5xl leading-[1.15] text-love-ink text-shadow-soft sm:text-6xl md:text-7xl lg:text-8xl"
        >
          {welcome.title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.7, ease: 'easeOut' }}
          className="font-serif text-xl italic text-love-ink/75 sm:text-2xl"
        >
          {welcome.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1, ease: 'easeOut' }}
          className="mt-4"
        >
          <motion.button
            type="button"
            autoFocus
            onClick={handleOpen}
            aria-label={`${welcome.button} — open the website`}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 360, damping: 20 }}
            className="glow-ring relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-gradient-to-br from-love-secondary via-rose-500 to-love-primary px-9 py-4 font-sans text-base font-medium tracking-wide text-white shadow-xl transition duration-300 hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-love-primary sm:px-11 sm:py-5 sm:text-lg"
          >
            <span
              aria-hidden="true"
              className="animate-shimmer absolute inset-0 opacity-70"
            />
            <span className="relative">{welcome.button}</span>
          </motion.button>
        </motion.div>
      </motion.div>

      {/* Heart burst on click */}
      <AnimatePresence>
        {burst.map((b) => (
          <motion.span
            key={b.id}
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 z-20 select-none"
            initial={{ opacity: 0, x: 0, y: 0, scale: 0.4, rotate: 0 }}
            animate={{
              opacity: [0, 1, 1, 0],
              x: b.x,
              y: b.y,
              scale: [0.4, 1.1, 1, 0.9],
              rotate: b.x > 0 ? 24 : -24,
            }}
            transition={{ duration: 1.1, delay: b.delay, ease: 'easeOut' }}
            style={{ fontSize: b.size, marginLeft: -b.size, marginTop: -b.size }}
          >
            {b.emoji}
          </motion.span>
        ))}
      </AnimatePresence>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6, duration: 1 }}
        className="absolute bottom-8 z-10 font-sans text-xs tracking-[0.3em] text-love-ink/45"
      >
        MADE WITH ❤️
      </motion.p>
    </motion.section>
  )
}
