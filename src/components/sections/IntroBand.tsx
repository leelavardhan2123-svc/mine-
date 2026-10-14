import { motion } from 'framer-motion'
import { ChevronDown, Heart } from 'lucide-react'
import { siteConfig } from '../../config/site'
import { daysSince, formatDate, scrollToSection } from '../../lib/utils'
import CountUp from '../ui/CountUp'

/** The opening band: names, anniversary and the days we have together. */
export default function IntroBand() {
  const { intro, myName, herName, anniversary } = siteConfig
  const days = daysSince(anniversary)

  return (
    <section
      id="top"
      aria-label={intro.title}
      className="relative flex min-h-screen scroll-mt-16 flex-col items-center justify-center gap-8 px-5 py-24 text-center"
    >
      <motion.div
        initial={{ opacity: 0, y: 34 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease: 'easeOut' }}
        className="flex flex-col items-center gap-6"
      >
        <span className="inline-flex items-center gap-3 font-sans text-[0.68rem] font-medium uppercase tracking-[0.42em] text-love-primary/80">
          Est. {formatDate(anniversary)}
        </span>

        <h1 className="font-script text-6xl leading-tight text-love-ink text-shadow-soft sm:text-7xl md:text-8xl lg:text-9xl">
          {intro.title}
        </h1>

        {/* The two of us */}
        <p className="flex flex-wrap items-center justify-center gap-3 font-serif text-xl text-love-ink/80 sm:gap-5 sm:text-3xl">
          <span>{myName}</span>
          <span
            aria-hidden="true"
            className="animate-heartbeat inline-flex"
          >
            <Heart className="h-6 w-6 fill-love-secondary text-love-secondary sm:h-8 sm:w-8" />
          </span>
          <span>{herName}</span>
        </p>

        {/* Days together */}
        <div className="glass rounded-full px-7 py-3.5">
          <p className="flex flex-wrap items-baseline justify-center gap-2">
            <span className="font-script text-4xl text-love-primary sm:text-5xl">
              <CountUp value={days} />
            </span>
            <span className="font-sans text-xs uppercase tracking-[0.25em] text-love-ink/60">
              {intro.daysLabel}
            </span>
          </p>
        </div>

        <p className="max-w-xl font-serif text-lg italic text-love-ink/70 sm:text-xl">
          {intro.subtitle}
        </p>
      </motion.div>

      <motion.button
        type="button"
        onClick={() => scrollToSection('story')}
        aria-label="Scroll down to our love story"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
        whileHover={{ y: 4 }}
        className="mt-4 flex flex-col items-center gap-2 rounded-full p-3 text-love-ink/60 transition hover:text-love-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-love-primary"
      >
        <motion.span
          animate={{ y: [0, 9, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className="h-7 w-7" aria-hidden="true" />
        </motion.span>
        <span className="font-sans text-[0.62rem] uppercase tracking-[0.3em]">
          Our story begins
        </span>
      </motion.button>
    </section>
  )
}
