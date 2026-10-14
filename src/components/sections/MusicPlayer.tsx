import { Music, Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { siteConfig } from '../../config/site'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { assetUrl } from '../../lib/utils'

/**
 * FEATURE 7 — an optional music player.
 *  • Never autoplays: the visitor starts the music themselves.
 *  • The file location comes from siteConfig.music.src.
 *  • A missing file simply disables the player (no console errors).
 */
export default function MusicPlayer() {
  const { music } = siteConfig
  const [muted, setMuted] = useLocalStorage<boolean>(
    'forever-with-you:muted',
    false,
  )
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState<boolean | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  /* Probe the file with a HEAD request first: if it is missing we never
     create an <audio> element, so no 404 media errors appear. */
  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()

    fetch(assetUrl(music.src), { method: 'HEAD', signal: controller.signal })
      .then((response) => {
        if (!cancelled) setAvailable(response.ok)
      })
      .catch(() => {
        if (!cancelled) setAvailable(false)
      })

    return () => {
      cancelled = true
      controller.abort()
    }
  }, [music.src])

  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted
  }, [muted])

  useEffect(() => {
    return () => {
      const audio = audioRef.current
      if (audio) {
        audio.pause()
        audio.src = ''
      }
    }
  }, [])

  const toggle = async () => {
    if (available === false) return

    let audio = audioRef.current
    if (!audio) {
      audio = new Audio(assetUrl(music.src))
      audio.loop = true
      audio.volume = 0.75
      audio.muted = muted
      audio.addEventListener('error', () => {
        setPlaying(false)
        setAvailable(false)
      })
      audioRef.current = audio
    }

    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }

    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  const unavailable = available === false
  const iconButton =
    'rounded-full p-2 text-love-ink/75 transition hover:bg-white/80 hover:text-love-primary disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-love-primary'

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-1 rounded-full border border-white/70 bg-white/70 py-1.5 pl-3 pr-1.5 shadow-[0_16px_44px_-22px_var(--love-primary)] backdrop-blur-xl sm:bottom-6 sm:right-6 sm:gap-2 sm:pl-4">
      {/* Equaliser */}
      <span aria-hidden="true" className="flex h-5 items-end gap-[3px]">
        {[0.7, 1, 0.55, 0.85].map((speed, i) => (
          <span
            key={i}
            className="w-[3px] origin-bottom rounded-full bg-love-secondary"
            style={{
              height: '100%',
              animation: playing
                ? `equalizer ${speed}s ease-in-out infinite`
                : 'none',
              transform: playing ? undefined : 'scaleY(0.35)',
              opacity: unavailable ? 0.35 : 1,
            }}
          />
        ))}
      </span>

      <span className="hidden font-sans text-xs tracking-wide text-love-ink/70 sm:block">
        {music.title}
      </span>

      <button
        type="button"
        onClick={toggle}
        disabled={unavailable}
        title={unavailable ? music.unavailableHint : undefined}
        aria-label={
          unavailable
            ? music.unavailableHint
            : playing
              ? music.pauseLabel
              : music.playLabel
        }
        className={iconButton}
      >
        {playing ? (
          <Pause className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Play className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      <button
        type="button"
        onClick={() => setMuted(!muted)}
        disabled={unavailable}
        aria-label={muted ? music.unmuteLabel : music.muteLabel}
        aria-pressed={muted}
        className={iconButton}
      >
        {muted ? (
          <VolumeX className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden="true" />
        )}
      </button>

      <Music className="hidden h-3.5 w-3.5 text-love-primary/50 sm:block" aria-hidden="true" />

      <span aria-live="polite" className="sr-only">
        {unavailable
          ? music.unavailableHint
          : playing
            ? 'Music is playing'
            : 'Music is paused'}
      </span>
    </div>
  )
}
