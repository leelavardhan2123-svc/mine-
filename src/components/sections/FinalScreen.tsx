import { Heart } from 'lucide-react'
import { siteConfig } from '../../config/site'
import { scrollToSection } from '../../lib/utils'
import FadeIn from '../ui/FadeIn'
import GlowButton from '../ui/GlowButton'

/** FEATURE 9 — the closing message and a way back to the memories. */
export default function FinalScreen() {
  const { final } = siteConfig

  return (
    <section
      id="final"
      aria-label="Forever"
      className="relative flex scroll-mt-16 flex-col items-center justify-center gap-9 px-5 py-28 text-center sm:py-32"
    >
      <FadeIn>
        <div
          aria-hidden="true"
          className="relative mx-auto flex h-28 w-28 items-center justify-center sm:h-32 sm:w-32"
        >
          <span
            className="absolute inset-0 rounded-full blur-2xl"
            style={{
              background:
                'radial-gradient(circle, color-mix(in oklab, var(--love-secondary) 45%, transparent), transparent 70%)',
            }}
          />
          <Heart className="animate-heartbeat relative h-16 w-16 fill-love-secondary text-love-secondary drop-shadow-lg sm:h-20 sm:w-20" />
        </div>
      </FadeIn>

      <FadeIn delay={0.15}>
        <p className="mx-auto max-w-3xl font-script text-4xl leading-snug text-love-ink text-shadow-soft sm:text-5xl md:text-6xl">
          {final.message}
        </p>
      </FadeIn>

      <FadeIn delay={0.3}>
        <p className="font-serif text-xl italic text-love-primary/85">
          {final.signature}
        </p>
      </FadeIn>

      <FadeIn delay={0.45}>
        <GlowButton size="lg" onClick={() => scrollToSection('story')}>
          <Heart className="h-5 w-5" aria-hidden="true" />
          {final.button}
        </GlowButton>
      </FadeIn>
    </section>
  )
}
