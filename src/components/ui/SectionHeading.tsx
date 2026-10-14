import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface SectionHeadingProps {
  eyebrow: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
  className?: string
}

/** Script heading with an eyebrow label and a delicate heart divider. */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className = '',
}: SectionHeadingProps) {
  const alignment =
    align === 'center' ? 'items-center text-center' : 'items-start text-left'

  return (
    <motion.header
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className={`mb-12 flex flex-col gap-3 sm:mb-16 ${alignment} ${className}`}
    >
      <span className="font-sans text-[0.68rem] font-medium uppercase tracking-[0.42em] text-love-primary/80">
        {eyebrow}
      </span>

      <h2 className="font-script text-4xl leading-tight text-love-ink text-shadow-soft sm:text-5xl md:text-6xl">
        {title}
      </h2>

      <span aria-hidden="true" className="flex items-center gap-3">
        <span className="h-px w-12 bg-gradient-to-r from-transparent to-love-primary/50 sm:w-20" />
        <Heart
          className="h-3.5 w-3.5 fill-love-secondary text-love-secondary"
          aria-hidden="true"
        />
        <span className="h-px w-12 bg-gradient-to-l from-transparent to-love-primary/50 sm:w-20" />
      </span>

      {subtitle && (
        <p className="max-w-xl font-serif text-lg italic text-love-ink/70 sm:text-xl">
          {subtitle}
        </p>
      )}
    </motion.header>
  )
}
