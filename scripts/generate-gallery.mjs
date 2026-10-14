/**
 * Generates the six romantic SVG placeholders used by the memory gallery.
 * Run with:  node scripts/generate-gallery.mjs
 * (Replace any file in public/gallery/ with your own photo — nothing here
 *  is required at runtime.)
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(here, '..', 'public', 'gallery')
mkdirSync(outDir, { recursive: true })

const HEART =
  'M12 21s-7.5-4.9-9.6-9.2C.7 8.3 2.6 4.6 6.1 4c2-.3 3.9.7 4.9 2.3C12 4.7 13.9 3.7 15.9 4c3.5.6 5.4 4.3 3.7 7.8C19.5 16.1 12 21 12 21Z'

const palettes = [
  { id: 'rose', from: '#fff1f3', via: '#ffe4e9', to: '#fecdd3', dot: '#fb7185' },
  { id: 'peach', from: '#fff7ed', via: '#ffedd5', to: '#fed7aa', dot: '#fb923c' },
  { id: 'gold', from: '#fefce8', via: '#fef3c7', to: '#fde68a', dot: '#f59e0b' },
  { id: 'lavender', from: '#f5f3ff', via: '#ede9fe', to: '#ddd6fe', dot: '#a78bfa' },
  { id: 'blush', from: '#fdf2f8', via: '#fce7f3', to: '#fbcfe8', dot: '#f472b6' },
  { id: 'wine', from: '#fff1f2', via: '#ffe4e6', to: '#fecdd3', dot: '#e11d48' },
]

const svg = (index) => {
  const p = palettes[index]
  const seed = index * 137
  const circles = Array.from({ length: 7 }, (_, i) => {
    const cx = ((seed + i * 149) % 760) + 20
    const cy = ((seed + i * 233) % 560) + 20
    const r = 26 + ((seed + i * 31) % 46)
    const opacity = 0.18 + (((seed + i * 17) % 30) / 100).toFixed(2)
    return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${p.dot}" opacity="${opacity}"/>`
  }).join('\n  ')

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" role="img" aria-label="Placeholder for photo number ${index + 1}">
  <defs>
    <linearGradient id="bg${index}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${p.from}"/>
      <stop offset="0.55" stop-color="${p.via}"/>
      <stop offset="1" stop-color="${p.to}"/>
    </linearGradient>
    <radialGradient id="glow${index}" cx="0.5" cy="0.4" r="0.55">
      <stop offset="0" stop-color="#ffffff" stop-opacity="0.95"/>
      <stop offset="1" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="800" height="600" fill="url(#bg${index})"/>
  <g opacity="0.5">
  ${circles}
  </g>
  <ellipse cx="400" cy="245" rx="310" ry="215" fill="url(#glow${index})"/>

  <g transform="translate(400 240) scale(8) translate(-12 -10.5)" opacity="0.42">
    <path d="${HEART}" fill="${p.dot}"/>
  </g>

  <text x="400" y="440" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-style="italic" font-size="46" fill="#411223" opacity="0.82">Our Memory</text>
  <text x="400" y="482" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" letter-spacing="6" fill="#411223" opacity="0.45">PLACE YOUR PHOTO HERE</text>
</svg>
`
}

palettes.forEach((_, index) => {
  const file = resolve(outDir, `memory-${index + 1}.svg`)
  writeFileSync(file, svg(index), 'utf8')
  console.log('created', file)
})
