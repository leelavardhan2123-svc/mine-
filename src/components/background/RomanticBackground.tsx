import { useMemo, type CSSProperties } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useTypewriter'
import { styleWithVars } from '../../lib/utils'

interface Particle {
  id: number
  left: number
  top: number
  size: number
  duration: number
  delay: number
  drift: number
  opacity: number
  kind: 'heart' | 'petal' | 'star'
}

const HEART_PATH =
  'M12 21s-7.5-4.9-9.6-9.2C.7 8.3 2.6 4.6 6.1 4c2-.3 3.9.7 4.9 2.3C12 4.7 13.9 3.7 15.9 4c3.5.6 5.4 4.3 3.7 7.8C19.5 16.1 12 21 12 21Z'

function buildParticles(count: number, seed: number): Particle[] {
  // Small deterministic pseudo-random generator so the layout stays stable
  // between renders and reloads.
  let state = seed * 9301 + 49297
  const random = () => {
    state = (state * 9301 + 49297) % 233280
    return state / 233280
  }

  return Array.from({ length: count }, (_, id) => {
    const roll = random()
    const kind: Particle['kind'] =
      roll > 0.62 ? 'heart' : roll > 0.3 ? 'petal' : 'star'
    return {
      id,
      left: random() * 100,
      top: 45 + random() * 60,
      size: 10 + random() * 16,
      duration: 16 + random() * 18,
      delay: -random() * 30,
      drift: (random() - 0.5) * 140,
      opacity: 0.2 + random() * 0.45,
      kind,
    }
  })
}

function starStyle(index: number, reduced: boolean): CSSProperties {
  const size = 2 + ((index * 7) % 4)
  const base: CSSProperties = {
    left: `${(index * 137) % 100}%`,
    top: `${(index * 61) % 100}%`,
    width: size,
    height: size,
  }
  if (reduced) return { ...base, opacity: 0.4 }
  return styleWithVars(
    { ...base, animationDelay: `${(index % 9) * -0.7}s` },
    { '--tw': `${3 + (index % 5)}s` },
  )
}

/**
 * Full-screen romantic backdrop: soft gradient wash, twinkling stars,
 * drifting petals and slow floating hearts. Purely decorative.
 */
export default function RomanticBackground() {
  const reduced = usePrefersReducedMotion()
  const particles = useMemo(() => buildParticles(34, 7), [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Base wash */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(1100px 700px at 12% 8%, color-mix(in oklab, var(--love-blush) 90%, transparent), transparent 60%),
            radial-gradient(900px 800px at 88% 18%, color-mix(in oklab, var(--love-lavender) 85%, transparent), transparent 62%),
            radial-gradient(1000px 900px at 50% 105%, color-mix(in oklab, var(--love-primary) 22%, transparent), transparent 65%),
            linear-gradient(180deg, var(--love-cream), color-mix(in oklab, var(--love-blush) 45%, var(--love-cream)))
          `,
        }}
      />

      {!reduced && (
        <>
          {/* Slow drifting colour blobs */}
          <div
            className="animate-blob absolute -left-40 top-10 h-96 w-96 rounded-full opacity-50 blur-3xl"
            style={styleWithVars(
              { background: 'color-mix(in oklab, var(--love-secondary) 30%, transparent)' },
              { '--dur': '32s' },
            )}
          />
          <div
            className="animate-blob absolute -right-32 top-1/3 h-80 w-80 rounded-full opacity-40 blur-3xl"
            style={styleWithVars(
              {
                background: 'color-mix(in oklab, var(--love-accent) 34%, transparent)',
                animationDelay: '-8s',
              },
              { '--dur': '38s' },
            )}
          />
        </>
      )}

      {/* Twinkling stars */}
      {Array.from({ length: 40 }, (_, i) => (
        <span
          key={`star-${i}`}
          className={`absolute rounded-full bg-white ${reduced ? '' : 'animate-twinkle'}`}
          style={{
            ...starStyle(i, reduced),
            boxShadow: reduced ? undefined : '0 0 8px rgba(255,255,255,0.9)',
          }}
        />
      ))}

      {/* Floating hearts, petals and tiny stars */}
      {!reduced &&
        particles.map((p) => {
          const motion = styleWithVars(
            {
              left: `${p.left}%`,
              top: `${p.top}%`,
              animationDelay: `${p.delay}s`,
              opacity: p.opacity,
            },
            {
              '--dur': `${p.duration}s`,
              '--drift': `${p.drift}px`,
              '--heart-opacity': p.opacity,
            },
          )

          if (p.kind === 'heart') {
            return (
              <svg
                key={p.id}
                className="float-heart absolute"
                width={p.size}
                height={p.size}
                viewBox="0 0 24 24"
                style={motion}
              >
                <path
                  d={HEART_PATH}
                  fill="color-mix(in oklab, var(--love-secondary) 65%, white)"
                />
              </svg>
            )
          }

          if (p.kind === 'petal') {
            return (
              <span
                key={p.id}
                className="float-petal absolute block rounded-full"
                style={{
                  ...motion,
                  width: p.size * 0.7,
                  height: p.size * 0.45,
                  background:
                    'linear-gradient(135deg, color-mix(in oklab, var(--love-blush) 80%, white), color-mix(in oklab, var(--love-secondary) 45%, white))',
                }}
              />
            )
          }

          return (
            <span
              key={p.id}
              className="float-petal absolute block text-love-accent"
              style={{
                ...motion,
                fontSize: p.size,
                animationDuration: `${p.duration * 1.3}s`,
              }}
            >
              ✦
            </span>
          )
        })}
    </div>
  )
}
