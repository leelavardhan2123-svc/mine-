import { motion, type HTMLMotionProps } from 'framer-motion'
import type { ReactNode } from 'react'

interface GlowButtonProps extends HTMLMotionProps<'button'> {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'ghost' | 'soft'
}

const sizes: Record<string, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-7 py-3 text-base',
  lg: 'px-9 py-4 text-lg',
}

const variants: Record<string, string> = {
  primary:
    'text-white bg-gradient-to-br from-love-secondary to-love-primary shadow-lg hover:brightness-110',
  ghost: 'glass text-love-ink hover:bg-white/80',
  soft: 'bg-love-blush text-love-primary hover:bg-white border border-love-primary/20',
}

/**
 * The signature call-to-action button: rounded, glowing, gently lifted
 * on hover and pressed on tap.
 */
export default function GlowButton({
  children,
  size = 'md',
  variant = 'primary',
  className = '',
  type = 'button',
  ...rest
}: GlowButtonProps) {
  return (
    <motion.button
      type={type}
      whileHover={{ y: -3, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 22 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full font-sans font-medium tracking-wide transition duration-300 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-love-primary disabled:pointer-events-none disabled:opacity-50 ${sizes[size]} ${variants[variant]} ${variant === 'primary' ? 'glow-ring' : ''} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
