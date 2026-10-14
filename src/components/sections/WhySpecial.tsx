import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import { siteConfig } from '../../config/site'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { usePrefersReducedMotion } from '../../hooks/useTypewriter'
import SectionHeading from '../ui/SectionHeading'

/** FEATURE 5 — cards that flip to reveal why she is special. */
export default function WhySpecial() {
  const { special } = siteConfig
  const reduced = usePrefersReducedMotion()
  const [revealed, setRevealed] = useLocalStorage<string[]>(
    'forever-with-you:revealed',
    [],
  )

  const toggle = (id: string) => {
    setRevealed((current) =>
      current.includes(id)
        ? current.filter((entry) => entry !== id)
        : [...current, id],
    )
  }

  const revealedCount = special.cards.filter((card) =>
    revealed.includes(card.id),
  ).length
  const allRevealed = revealedCount === special.cards.length

  return (
    <section
      id="special"
      aria-label={special.title}
      className="relative mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-24 sm:px-6 sm:py-28"
    >
      <SectionHeading
        eyebrow={special.eyebrow}
        title={special.title}
        subtitle={special.subtitle}
      />

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {special.cards.map((card, index) => {
          const isRevealed = revealed.includes(card.id)

          return (
            <motion.li
              key={card.id}
              initial={{ opacity: 0, y: 34 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: 'easeOut' }}
            >
              <button
                type="button"
                aria-pressed={isRevealed}
                aria-label={
                  isRevealed
                    ? `Hide reason: ${card.title}`
                    : `Reveal reason ${index + 1} of ${special.cards.length}`
                }
                onClick={() => toggle(card.id)}
                style={{ perspective: 1200 }}
                className="grid h-full w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-love-primary"
              >
                <motion.span
                  animate={{ rotateY: isRevealed ? 180 : 0 }}
                  transition={{
                    duration: reduced ? 0 : 0.75,
                    ease: [0.4, 0, 0.2, 1],
                  }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="grid"
                >
                  {/* ── Back (waiting to be discovered) ── */}
                  <span
                    className="glass flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-3xl p-6 text-center"
                    style={{
                      gridArea: '1 / 1',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                    }}
                  >
                    <span
                      className="flex h-14 w-14 items-center justify-center rounded-full text-2xl shadow-lg"
                      style={{
                        background:
                          'linear-gradient(140deg, var(--love-blush), color-mix(in oklab, var(--love-secondary) 30%, white))',
                      }}
                      aria-hidden="true"
                    >
                      💝
                    </span>
                    <span className="font-script text-2xl text-love-primary">
                      Reason #{index + 1}
                    </span>
                    <span className="font-sans text-[0.65rem] uppercase tracking-[0.3em] text-love-ink/55">
                      Tap to reveal
                    </span>
                  </span>

                  {/* ── Front (the reason) ── */}
                  <span
                    className="flex h-full min-h-64 flex-col items-center justify-center gap-3 rounded-3xl border border-white/70 p-6 text-center shadow-[0_18px_50px_-30px_var(--love-primary)]"
                    style={{
                      gridArea: '1 / 1',
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                      background: `linear-gradient(150deg, white, ${
                        index % 2 === 0
                          ? 'color-mix(in oklab, var(--love-blush) 75%, white)'
                          : 'color-mix(in oklab, var(--love-lavender) 80%, white)'
                      })`,
                    }}
                  >
                    <span className="text-3xl" aria-hidden="true">
                      {card.emoji}
                    </span>
                    <span className="font-script text-2xl leading-snug text-love-ink">
                      {card.title}
                    </span>
                    <span className="font-serif text-[0.95rem] leading-relaxed text-love-ink/80 sm:text-base">
                      {card.message}
                    </span>
                  </span>
                </motion.span>
              </button>
            </motion.li>
          )
        })}
      </ul>

      {/* Little reward when every card has been discovered */}
      <motion.p
        aria-live="polite"
        initial={false}
        animate={{ opacity: allRevealed ? 1 : 0, y: allRevealed ? 0 : 12 }}
        transition={{ duration: 0.6 }}
        className={`mx-auto mt-10 flex max-w-xl items-center justify-center gap-2 text-center font-serif text-lg italic text-love-primary ${
          allRevealed ? '' : 'pointer-events-none'
        }`}
      >
        <Sparkles className="h-5 w-5 shrink-0" aria-hidden="true" />
        {special.allRevealed}
      </motion.p>
    </section>
  )
}
