import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, Heart, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import type { GalleryItem } from '../../config/site'
import { useModalFocus } from '../../hooks/useModalFocus'
import { assetUrl } from '../../lib/utils'

interface GalleryLightboxProps {
  items: readonly GalleryItem[]
  index: number
  onClose: () => void
  onNavigate: (direction: -1 | 1) => void
}

/** Full-screen viewer with keyboard navigation (← → Esc). */
export default function GalleryLightbox({
  items,
  index,
  onClose,
  onNavigate,
}: GalleryLightboxProps) {
  const panelRef = useRef<HTMLDivElement>(null)
  const item = items[index]
  useModalFocus(panelRef, true, onClose)

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        onNavigate(-1)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        onNavigate(1)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onNavigate])

  if (!item) return null

  return (
    <motion.div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Photo viewer: ${item.caption}`}
      tabIndex={-1}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      {/* Close */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Close photo viewer"
        className="absolute right-4 top-4 rounded-full border border-white/25 bg-white/10 p-2.5 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white sm:right-6 sm:top-6"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.figure
          key={item.id}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="flex max-h-full w-full max-w-4xl flex-col items-center gap-4"
        >
          <img
            src={assetUrl(item.src)}
            alt={item.alt}
            className="max-h-[68vh] w-auto max-w-full rounded-2xl object-contain shadow-2xl"
          />
          <figcaption className="text-center">
            <p className="font-script text-2xl text-white sm:text-3xl">
              {item.caption}
            </p>
            <p className="mt-1 font-sans text-[0.7rem] uppercase tracking-[0.3em] text-white/55">
              {index + 1} / {items.length}
            </p>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      {/* Controls */}
      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => onNavigate(-1)}
          aria-label="Previous photo"
          className="rounded-full border border-white/25 bg-white/10 p-3 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
        >
          <ChevronLeft className="h-5 w-5" aria-hidden="true" />
        </button>

        <span
          aria-hidden="true"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-rose-600"
        >
          <Heart className="h-5 w-5 fill-white text-white" />
        </span>

        <button
          type="button"
          onClick={() => onNavigate(1)}
          aria-label="Next photo"
          className="rounded-full border border-white/25 bg-white/10 p-3 text-white transition hover:bg-white/25 focus-visible:outline-2 focus-visible:outline-white"
        >
          <ChevronRight className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>
    </motion.div>
  )
}
