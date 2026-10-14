import { siteConfig } from '../../config/site'
import { clearLoveStoryStorage } from '../../hooks/useLocalStorage'

/** Small print + an honest note about where preferences live. */
export default function SiteFooter() {
  const { final, myName } = siteConfig

  const restart = () => {
    const confirmed = window.confirm(
      'Start over from the beginning?\n\nThis clears the small preferences saved in this browser on this device — nothing is stored online.',
    )
    if (!confirmed) return
    clearLoveStoryStorage()
    window.location.reload()
  }

  return (
    <footer className="relative border-t border-love-primary/15 px-5 py-10 text-center">
      <p className="font-sans text-xs leading-relaxed tracking-wide text-love-ink/55">
        {final.privacyNote}
      </p>
      <p className="mt-2 font-script text-xl text-love-primary">
        For {myName}’s favourite person ❤️
      </p>
      <button
        type="button"
        onClick={restart}
        className="mt-4 font-sans text-[0.68rem] uppercase tracking-[0.28em] text-love-ink/45 underline decoration-dotted underline-offset-4 transition hover:text-love-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-love-primary"
      >
        {final.restartLabel}
      </button>
    </footer>
  )
}
