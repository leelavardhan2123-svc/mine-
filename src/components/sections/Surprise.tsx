import { AnimatePresence, motion } from 'framer-motion'
import { Heart, RotateCcw, Sparkles, X } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { siteConfig } from '../../config/site'
import { useModalFocus } from '../../hooks/useModalFocus'
import GlowButton from '../ui/GlowButton'

interface Spark {
  id: number
  angle: number
  distance: number
  size: number
  delay: number
  glyph: string
  tone: number
}

const GLYPHS = ['❤️', '💕', '✨', '💗', '✦', '💖', '🌷', '✨', '💞', '🌹']

function buildSparkles(burstId: number): Spark[] {
  let state = burstId * 7919 + 104729
  const random = () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }

  return Array.from({ length: 30 }, (_, i) => ({
    id: burstId * 1000 + i,
    angle: (i / 30) * Math.PI * 2 + random() * 0.4,
    distance: 110 + random() * 190,
    size: 15 + random() * 16,
    delay: random() * 0.35,
    glyph: GLYPHS[i % GLYPHS.length],
    tone: random(),
  }))
}

/** FEATURE 6 — dimmed overlay, beating heart, hearts & sparkles, message. */
export default function Surprise() {
  const { surprise } = siteConfig
  const [isOpen, setIsOpen] = useState(false)
  const [burstId, setBurstId] = useState(0)
  const dialogRef = useRef<HTMLDivElement>(null)

  useModalFocus(dialogRef, isOpen, () => setIsOpen(false))

  const sparkles = useMemo(() => buildSparkles(burstId), [burstId])

  const open = () => {
    setBurstId((id) => id + 1)
    setIsOpen(true)
  }

  const replay = () => setBurstId((id) => id + 1)

  return (
    <section
      id="surprise"
      aria-label={surprise.eyebrow}
      className="relative flex flex-col items-center gap-8 px-5 py-24 text-center sm:py-28"
    >
      <span className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.42em] text-love-primary/80">
        {surprise.eyebrow}
      </span>

      <GlowButton size="lg" onClick={open}>
        <Sparkles className="h-5 w-5" aria-hidden="true" />
        {surprise.button}
      </GlowButton>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={surprise.heading}
            aria-describedby="surprise-message"
            tabIndex={-1}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md sm:p-6"
            onClick={(event) => {
              if (event.target === event.currentTarget) setIsOpen(false)
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              className="relative w-full max-w-xl overflow-hidden rounded-[2rem] border border-white/40 bg-white/85 p-7 text-center shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-10"
            >
              {/* Close (first focusable — receives focus on open) */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label={surprise.closeLabel}
                className="absolute right-4 top-4 rounded-full border border-rose-200 bg-white/70 p-2 text-love-ink/70 transition hover:bg-white hover:text-love-primary focus-visible:outline-2 focus-visible:outline-love-primary"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>

              {/* Floating hearts & sparkles released from the heart */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden"
              >
                {sparkles.map((spark) => (
                  <motion.span
                    key={spark.id}
                    className="absolute left-1/2 top-1/2 select-none"
                    style={{ fontSize: spark.size, marginLeft: -spark.size }}
                    initial={{ opacity: 0, x: 0, y: 0, scale: 0.3, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      x: Math.cos(spark.angle) * spark.distance,
                      y: Math.sin(spark.angle) * spark.distance - 30,
                      scale: [0.3, 1.15, 1, 0.85],
                      rotate: spark.tone > 0.5 ? 30 : -30,
                    }}
                    transition={{
                      duration: 2.4,
                      delay: spark.delay,
                      ease: 'easeOut',
                    }}
                  >
                    {spark.glyph}
                  </motion.span>
                ))}
              </div>

              {/* The beating heart */}
              <div
                aria-hidden="true"
                className="relative mx-auto mt-2 flex h-32 w-32 items-center justify-center sm:h-36 sm:w-36"
              >
                <span
                  className="absolute inset-0 rounded-full blur-2xl"
                  style={{
                    background:
                      'radial-gradient(circle, color-mix(in oklab, var(--love-secondary) 55%, transparent), transparent 70%)',
                  }}
                />
                <motion.span
                  className="animate-heartbeat"
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 14 }}
                >
                  <Heart className="h-20 w-20 fill-love-secondary text-love-secondary drop-shadow-lg sm:h-24 sm:w-24" />
                </motion.span>
              </div>

              <motion.p className="mt-3 font-sans text-[0.65rem] font-medium uppercase tracking-[0.4em] text-love-primary/80">
                {surprise.heading}
              </motion.p>

              <motion.p
                id="surprise-message"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.55, ease: 'easeOut' }}
                className="mx-auto mt-5 max-w-lg font-serif text-lg italic leading-relaxed text-love-ink/85 sm:text-xl"
              >
                {surprise.message}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1 }}
                className="mt-7 flex flex-wrap items-center justify-center gap-3"
              >
                <GlowButton variant="soft" size="sm" onClick={replay}>
                  <RotateCcw className="h-4 w-4" aria-hidden="true" />
                  {surprise.replayButton}
                </GlowButton>
                <GlowButton
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  Close 💕
                </GlowButton>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}
