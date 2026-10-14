import { motion, useInView } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Smile,
  Sparkles,
  Star,
  type LucideIcon,
} from 'lucide-react'
import { useRef } from 'react'
import { siteConfig, type MilestoneIcon } from '../../config/site'
import SectionHeading from '../ui/SectionHeading'

const ICONS: Record<MilestoneIcon, LucideIcon> = {
  heart: Heart,
  message: MessageCircle,
  star: Star,
  smile: Smile,
  sparkles: Sparkles,
}

/** FEATURE 2 — an alternating timeline of our milestones. */
export default function LoveStory() {
  const { story } = siteConfig
  // The line scales from scaleY(0), which makes it a zero-area element —
  // IntersectionObserver would never see it enter view. So we watch a
  // plain full-height wrapper and animate the line inside it.
  const trackRef = useRef<HTMLDivElement>(null)
  const lineInView = useInView(trackRef, { once: true, amount: 0.05 })

  return (
    <section
      id="story"
      aria-label={story.title}
      className="relative mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-24 sm:px-6 sm:py-28"
    >
      <SectionHeading
        eyebrow={story.eyebrow}
        title={story.title}
        subtitle={story.subtitle}
      />

      <div className="relative" ref={trackRef}>
        {/* The line of our story, drawn as you scroll */}
        <span
          aria-hidden="true"
          className="absolute left-6 top-0 h-full w-px -translate-x-1/2 md:left-1/2"
        >
          <motion.span
            className="block h-full w-full origin-top bg-gradient-to-b from-love-primary/60 via-love-secondary/45 to-transparent"
            initial={{ scaleY: 0 }}
            animate={lineInView ? { scaleY: 1 } : { scaleY: 0 }}
            transition={{ duration: 1.6, ease: 'easeOut' }}
          />
        </span>

        <ol className="relative space-y-10 md:space-y-16">
          {story.milestones.map((milestone, index) => {
            const Icon = ICONS[milestone.icon] ?? Heart
            const even = index % 2 === 0

            return (
              <motion.li
                key={milestone.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
                className="relative pl-16 md:grid md:grid-cols-2 md:gap-16 md:pl-0"
              >
                {/* Marker on the line */}
                <span
                  aria-hidden="true"
                  className="absolute left-6 top-8 z-10 flex h-11 w-11 -translate-x-1/2 items-center justify-center rounded-full border border-white/70 bg-gradient-to-br from-love-secondary to-love-primary text-white shadow-[0_10px_30px_-10px_var(--love-primary)] md:left-1/2"
                >
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </span>

                <div
                  className={
                    even
                      ? 'md:col-start-1 md:pr-6 md:text-right'
                      : 'md:col-start-2 md:pl-6'
                  }
                >
                  <article className="glass rounded-3xl p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-30px_var(--love-primary)] sm:p-7">
                    <time className="font-script text-2xl text-love-primary">
                      {milestone.date}
                    </time>
                    <h3 className="mt-1 font-serif text-xl font-semibold text-love-ink sm:text-2xl">
                      {milestone.title}
                    </h3>
                    <p className="mt-3 font-serif text-base leading-relaxed text-love-ink/75 sm:text-lg">
                      {milestone.description}
                    </p>
                  </article>
                </div>
              </motion.li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}
