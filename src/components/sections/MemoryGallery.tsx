import { AnimatePresence, motion } from 'framer-motion'
import { Expand, Heart } from 'lucide-react'
import { useState } from 'react'
import { siteConfig } from '../../config/site'
import { assetUrl } from '../../lib/utils'
import SectionHeading from '../ui/SectionHeading'
import GalleryLightbox from './GalleryLightbox'

/** Feature 4 — an elegant, responsive gallery of our photos. */
const SPAN_PATTERN = [
  'md:col-span-4',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-2',
  'md:col-span-6',
]

export default function MemoryGallery() {
  const { gallery } = siteConfig
  const [activeIndex, setActiveIndex] = useState<number | null>(null)
  const [failed, setFailed] = useState<Record<string, boolean>>({})

  const navigate = (direction: -1 | 1) => {
    setActiveIndex((current) => {
      if (current === null) return current
      return (current + direction + gallery.items.length) % gallery.items.length
    })
  }

  return (
    <section
      id="gallery"
      aria-label={gallery.title}
      className="relative mx-auto w-full max-w-6xl scroll-mt-16 px-5 py-24 sm:px-6 sm:py-28"
    >
      <SectionHeading
        eyebrow={gallery.eyebrow}
        title={gallery.title}
        subtitle={gallery.subtitle}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-6">
        {gallery.items.map((item, index) => {
          const broken = failed[item.id]
          return (
            <motion.button
              key={item.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Open memory: ${item.caption}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: 'easeOut' }}
              className={`group relative aspect-[4/3] overflow-hidden rounded-3xl shadow-[0_18px_50px_-30px_var(--love-primary)] transition duration-500 hover:-translate-y-1 hover:shadow-[0_28px_70px_-30px_var(--love-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-love-primary ${SPAN_PATTERN[index % SPAN_PATTERN.length]}`}
            >
              {broken ? (
                /* Graceful fallback if a photo is missing */
                <span
                  className="flex h-full w-full flex-col items-center justify-center gap-2"
                  style={{
                    background:
                      'linear-gradient(140deg, var(--love-blush), color-mix(in oklab, var(--love-lavender) 70%, white))',
                  }}
                >
                  <Heart className="h-8 w-8 fill-love-secondary text-love-secondary" />
                  <span className="font-sans text-[0.65rem] uppercase tracking-[0.25em] text-love-ink/60">
                    Add your photo
                  </span>
                </span>
              ) : (
                <img
                  src={assetUrl(item.src)}
                  alt={item.alt}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  onError={() =>
                    setFailed((current) => ({ ...current, [item.id]: true }))
                  }
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                />
              )}

              {/* Frosted caption chip */}
              <span
                className={`absolute inset-x-2.5 bottom-2.5 flex items-end justify-between gap-2 rounded-2xl border border-white/50 bg-white/60 px-3 py-2 shadow-sm backdrop-blur-md transition duration-300 sm:inset-x-3.5 sm:bottom-3.5 sm:px-4 sm:py-2.5 ${
                  broken ? 'hidden' : ''
                }`}
              >
                <span className="text-left">
                  <span className="block font-script text-lg leading-snug text-love-ink sm:text-xl">
                    {item.caption}
                  </span>
                  <span className="mt-0.5 block font-sans text-[0.6rem] uppercase tracking-[0.28em] text-love-ink/55">
                    View memory
                  </span>
                </span>
                <span className="rounded-full bg-love-primary/10 p-1.5 text-love-primary opacity-70 transition duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <Expand className="h-3.5 w-3.5" aria-hidden="true" />
                </span>
              </span>
            </motion.button>
          )
        })}
      </div>

      <AnimatePresence>
        {activeIndex !== null && (
          <GalleryLightbox
            items={gallery.items}
            index={activeIndex}
            onClose={() => setActiveIndex(null)}
            onNavigate={navigate}
          />
        )}
      </AnimatePresence>
    </section>
  )
}
