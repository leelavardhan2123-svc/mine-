import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface FadeInProps {
  children: ReactNode
  delay?: number
  y?: number
  className?: string
  /** How much of the element must be visible before it animates in */
  amount?: number
}

/** Scroll-triggered fade + rise (plays once). */
export default function FadeIn({
  children,
  delay = 0,
  y = 34,
  className = '',
  amount = 0.25,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.75, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
