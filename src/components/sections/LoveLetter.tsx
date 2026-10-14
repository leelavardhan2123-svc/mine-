import { AnimatePresence, motion } from 'framer-motion'
import { Heart, Mail } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '../../config/site'
import { usePrefersReducedMotion, useTypewriter } from '../../hooks/useTypewriter'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import GlowButton from '../ui/GlowButton'
import SectionHeading from '../ui/SectionHeading'

type Phase = 'closed' | 'opening' | 'open'

/** FEATURE 3 — an interactive envelope that reveals a typed love letter. */
export default function LoveLetter() {
  const { letter, myName, herName } = siteConfig
  const reduced = usePrefersReducedMotion()

  const [storedPhase, setStoredPhase] = useLocalStorage<Phase>(
    'forever-with-you:letter',
    'closed',
  )
  // Visitors whose letter is already open get it typed out again on return.
  const [phase, setPhase] = useState<Phase>(() =>
    storedPhase === 'open' ? 'open' : 'closed',
  )
  const [typing, setTyping] = useState(true)

  const timerRef = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  const { displayed, isDone, skip, replay } = useTypewriter(letter.body, {
    start: typing && phase === 'open',
    speed: 12,
  })

  const openEnvelope = () => {
    if (phase !== 'closed') return
    setPhase('opening')
    setTyping(true)
    timerRef.current = window.setTimeout(
      () => {
        setPhase('open')
        setStoredPhase('open')
      },
      reduced ? 0 : 700,
    )
  }

  const closeLetter = () => {
    window.clearTimeout(timerRef.current)
    setPhase('closed')
    setTyping(false)
    replay()
    setStoredPhase('closed')
  }

  const readAgain = () => replay()

  return (
    <section
      id="letter"
      aria-label={letter.title}
      className="relative mx-auto w-full max-w-4xl scroll-mt-16 px-5 py-24 sm:px-6 sm:py-28"
    >
      <SectionHeading
        eyebrow={letter.eyebrow}
        title={letter.title}
        subtitle={letter.subtitle}
      />

      <AnimatePresence mode="wait">
        {phase !== 'open' ? (
          /* ── The envelope ─────────────────────────────────── */
          <motion.div
            key="envelope"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24, transition: { duration: 0.35 } }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="flex flex-col items-center gap-7"
          >
            <motion.button
              type="button"
              onClick={openEnvelope}
              aria-expanded={phase === 'opening'}
              aria-label={`Open the love letter. ${letter.openHint}`}
              whileHover={{ y: -6, rotate: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="relative block aspect-[16/10] w-full max-w-lg cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-love-primary"
              style={{ perspective: 1200 }}
            >
              {/* Envelope back + letter tucked inside */}
              <span
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl"
                style={{
                  background:
                    'linear-gradient(150deg, var(--love-blush), color-mix(in oklab, var(--love-cream) 70%, var(--love-lavender)))',
                  boxShadow:
                    '0 30px 70px -35px color-mix(in oklab, var(--love-primary) 70%, transparent)',
                }}
              />
              <motion.span
                aria-hidden="true"
                className="paper absolute left-[7%] right-[7%] top-[9%] h-[82%] rounded-lg"
                animate={{
                  y: phase === 'opening' ? '-26%' : '0%',
                }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <span className="absolute left-4 right-4 top-6 space-y-2.5 sm:left-6 sm:right-6">
                  <span className="block h-1.5 w-3/4 rounded-full bg-love-primary/25" />
                  <span className="block h-1.5 w-full rounded-full bg-love-primary/15" />
                  <span className="block h-1.5 w-5/6 rounded-full bg-love-primary/15" />
                </span>
              </motion.span>

              {/* Front pocket with its V-notch */}
              <span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-[64%] rounded-b-2xl"
                style={{
                  clipPath: 'polygon(0 0, 50% 58%, 100% 0, 100% 100%, 0 100%)',
                  background:
                    'linear-gradient(180deg, color-mix(in oklab, var(--love-blush) 85%, white), color-mix(in oklab, var(--love-secondary) 22%, white))',
                }}
              />

              {/* Flap — hinges at the top edge */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-[64%] rounded-t-2xl"
                style={{
                  clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                  background:
                    'linear-gradient(180deg, color-mix(in oklab, var(--love-lavender) 70%, white), var(--love-blush))',
                  transformOrigin: 'center top',
                  backfaceVisibility: 'hidden',
                }}
                animate={{ rotateX: phase === 'closed' ? 0 : -178 }}
                transition={{ duration: 0.65, ease: 'easeInOut' }}
              />

              {/* Wax seal with a heart */}
              <motion.span
                aria-hidden="true"
                className="absolute left-1/2 top-[57%] z-20 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-white/60 text-white shadow-lg sm:h-16 sm:w-16"
                style={{
                  background:
                    'radial-gradient(circle at 32% 28%, #fb7185, var(--love-primary) 70%)',
                }}
                animate={
                  phase === 'closed'
                    ? { scale: 1, opacity: 1 }
                    : { scale: 0.4, opacity: 0 }
                }
                transition={{ duration: 0.4, ease: 'easeIn' }}
              >
                <Heart className="h-6 w-6 fill-white sm:h-7 sm:w-7" />
              </motion.span>
            </motion.button>

            <p className="flex items-center gap-2 font-sans text-sm tracking-[0.2em] text-love-ink/55">
              <Mail className="h-4 w-4 text-love-primary" aria-hidden="true" />
              {phase === 'opening' ? 'Opening your letter…' : letter.openHint}
            </p>
          </motion.div>
        ) : (
          /* ── The letter ───────────────────────────────────── */
          <motion.article
            key="letter"
            initial={{ opacity: 0, y: 46, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, transition: { duration: 0.3 } }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="paper relative mx-auto w-full max-w-2xl rounded-3xl p-7 sm:p-10"
          >
            {/* Decorative corner hearts */}
            <Heart
              aria-hidden="true"
              className="absolute -left-3 -top-3 h-7 w-7 rotate-[-12deg] fill-love-secondary text-love-secondary opacity-80"
            />
            <Heart
              aria-hidden="true"
              className="absolute -bottom-3 -right-3 h-7 w-7 rotate-[12deg] fill-love-secondary text-love-secondary opacity-80"
            />

            <p className="text-center font-script text-3xl text-love-primary sm:text-4xl">
              A letter for {herName}
            </p>

            <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-love-primary/50 to-transparent" />

            <div className="mt-6 min-h-[16rem] font-serif text-lg leading-[1.85] text-love-ink/85 sm:min-h-[18rem] sm:text-xl">
              <p className="whitespace-pre-line">
                {displayed}
                {!isDone && (
                  <span aria-hidden="true" className="animate-caret font-sans text-love-primary">
                    |
                  </span>
                )}
              </p>
            </div>

            <motion.p
              animate={{ opacity: isDone ? 1 : 0 }}
              transition={{ duration: 0.8 }}
              className="mt-6 text-right font-script text-2xl text-love-primary sm:text-3xl"
            >
              {letter.signature} {myName} ❤️
            </motion.p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              {!isDone ? (
                <GlowButton variant="ghost" size="sm" onClick={skip}>
                  Skip the writing ✨
                </GlowButton>
              ) : (
                <GlowButton variant="ghost" size="sm" onClick={readAgain}>
                  {letter.replayButton}
                </GlowButton>
              )}
              <GlowButton variant="soft" size="sm" onClick={closeLetter}>
                Close the letter ✉️
              </GlowButton>
            </div>
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  )
}
