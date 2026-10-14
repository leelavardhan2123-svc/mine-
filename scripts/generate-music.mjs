/**
 * Generates  public/audio/our-song.wav  — a soft, 16-second ambient
 * music-box loop used as a PLACEHOLDER so the player works out of the box.
 *
 * Replace it with a song you both love (see public/audio/README.md):
 *   node scripts/generate-music.mjs
 *
 * Sound design: gentle music-box melody over a warm pad and a soft bass,
 * following a C – G – Am – F loop, with a light echo and a wrapped tail so
 * the loop repeats seamlessly.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const SAMPLE_RATE = 22050
const DURATION = 16 // seconds — four 4-second chords
const TOTAL = SAMPLE_RATE * DURATION
const TAIL = SAMPLE_RATE * 2 // extra room for ringing notes (folded back)

const buf = new Float64Array(TOTAL + TAIL)
const melody = new Float64Array(TOTAL + TAIL)

const hz = (midi) => 440 * Math.pow(2, (midi - 69) / 12)

/** Music-box tone: bell-like, fast attack, long decay. */
function addMusicBox(target, startSec, midi, gain) {
  const start = Math.round(startSec * SAMPLE_RATE)
  const freq = hz(midi)
  const len = Math.round(2 * SAMPLE_RATE)
  for (let i = 0; i < len && start + i < target.length; i += 1) {
    const t = i / SAMPLE_RATE
    const env = Math.exp(-t / 0.8) * (1 - Math.exp(-t / 0.004))
    const w = 2 * Math.PI * freq * t
    const s = Math.sin(w) + 0.32 * Math.sin(2 * w) + 0.1 * Math.sin(3 * w)
    target[start + i] += gain * env * s
  }
}

/** Warm pad: two slightly detuned sines with a soft swell. */
function addPad(startSec, durSec, midis, gain) {
  const start = Math.round(startSec * SAMPLE_RATE)
  const len = Math.round(durSec * SAMPLE_RATE)
  for (const midi of midis) {
    const freq = hz(midi)
    for (let i = 0; i < len && start + i < buf.length; i += 1) {
      const t = i / SAMPLE_RATE
      const attack = Math.min(1, t / 0.6)
      const release = Math.min(1, (durSec - t) / 0.8)
      const env = Math.max(0, Math.min(attack, release))
      const w = 2 * Math.PI * freq * t
      const s = Math.sin(w) + 0.7 * Math.sin(2 * Math.PI * freq * 0.997 * t)
      buf[start + i] += gain * env * s * 0.5
    }
  }
}

/** Soft bass: pure sine with a slow fade. */
function addBass(startSec, midi, gain) {
  const start = Math.round(startSec * SAMPLE_RATE)
  const freq = hz(midi)
  const len = Math.round(3.9 * SAMPLE_RATE)
  for (let i = 0; i < len && start + i < buf.length; i += 1) {
    const t = i / SAMPLE_RATE
    const env = Math.exp(-t / 1.4) * (1 - Math.exp(-t / 0.02))
    buf[start + i] += gain * env * Math.sin(2 * Math.PI * freq * t)
  }
}

/* ── Arrangement ─────────────────────────────────────────────── */

const chords = [
  { at: 0, bass: 48, pad: [60, 64, 67] }, // C major
  { at: 4, bass: 43, pad: [55, 59, 62] }, // G major
  { at: 8, bass: 45, pad: [57, 60, 64] }, // A minor
  { at: 12, bass: 41, pad: [53, 57, 60] }, // F major
]

const melodyNotes = [72, 76, 79, 76, 74, 71, 74, 79, 72, 76, 81, 76, 72, 77, 81, 77]

for (const chord of chords) {
  addPad(chord.at, 4.4, chord.pad, 0.09)
  addBass(chord.at, chord.bass, 0.17)

  // Gentle off-beat sparkle one octave up
  for (let half = 0.5; half < 4; half += 1) {
    const tone = chord.pad[(half * 2) % 3]
    addMusicBox(buf, chord.at + half, tone + 12, 0.07)
  }
}

// Main melody — one note per second
melodyNotes.forEach((midi, i) => addMusicBox(melody, i, midi, 0.3))

// Light echo on the melody only (dotted-eighth + quarter)
const echo = (delaySec, gain) => {
  const delay = Math.round(delaySec * SAMPLE_RATE)
  for (let i = delay; i < melody.length; i += 1) {
    melody[i] += melody[i - delay] * gain
  }
}
echo(0.375, 0.3)
echo(0.75, 0.14)

for (let i = 0; i < melody.length; i += 1) buf[i] += melody[i]

// Fold ringing notes past the end back to the start → seamless loop
for (let i = TOTAL; i < buf.length; i += 1) buf[i - TOTAL] += buf[i]

/* ── Normalise + write a 16-bit mono WAV ─────────────────────── */

let peak = 0
for (let i = 0; i < TOTAL; i += 1) peak = Math.max(peak, Math.abs(buf[i]))
const scale = peak > 0 ? 0.82 / peak : 1

const dataSize = TOTAL * 2
const wav = Buffer.alloc(44 + dataSize)
wav.write('RIFF', 0)
wav.writeUInt32LE(36 + dataSize, 4)
wav.write('WAVE', 8)
wav.write('fmt ', 12)
wav.writeUInt32LE(16, 16)
wav.writeUInt16LE(1, 20)
wav.writeUInt16LE(1, 22)
wav.writeUInt32LE(SAMPLE_RATE, 24)
wav.writeUInt32LE(SAMPLE_RATE * 2, 28)
wav.writeUInt16LE(2, 32)
wav.writeUInt16LE(16, 34)
wav.write('data', 36)
wav.writeUInt32LE(dataSize, 40)

for (let i = 0; i < TOTAL; i += 1) {
  const sample = Math.max(-1, Math.min(1, buf[i] * scale))
  wav.writeInt16LE(Math.round(sample * 32767), 44 + i * 2)
}

const outDir = resolve(dirname(fileURLToPath(import.meta.url)), '..', 'public', 'audio')
mkdirSync(outDir, { recursive: true })
const outFile = resolve(outDir, 'our-song.wav')
writeFileSync(outFile, wav)

console.log(
  `created ${outFile} — ${(dataSize / 1024 / 1024).toFixed(2)} MB, ` +
    `${DURATION}s @ ${SAMPLE_RATE}Hz, peak ${(peak * scale).toFixed(2)}`,
)
