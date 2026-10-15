import { useState } from 'react'
import type { ReactNode } from 'react'
import { GraduationCap, Menu, ShieldCheck, WifiOff, X } from 'lucide-react'
import AssistantWidget from '../components/AssistantWidget.tsx'
import { navigate } from '../hooks/useHashRoute.ts'
import { useInclusiveMode, useOnline } from '../hooks/useApp.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { LANGS } from '../i18n/context.ts'
import type { Lang } from '../i18n/context.ts'
import { clearAllSahayakData } from '../services/storage.ts'
import { speakText, speechSupported, voiceTagFor } from '../services/speech.ts'

const NAV_ITEMS: { to: string; key: 'nav.home' | 'nav.discover' | 'nav.directory' | 'nav.passport' | 'nav.family' | 'nav.about' }[] = [
  { to: '/', key: 'nav.home' },
  { to: '/discover', key: 'nav.discover' },
  { to: '/directory', key: 'nav.directory' },
  { to: '/passport', key: 'nav.passport' },
  { to: '/family', key: 'nav.family' },
  { to: '/about', key: 'nav.about' },
]

function LangSwitcher() {
  const { lang, setLang, t } = useI18n()
  return (
    <select
      id="lang-switch"
      aria-label={t('lang.label')}
      value={lang}
      onChange={(event) => setLang(event.target.value as Lang)}
      className="max-w-[7.5rem] cursor-pointer rounded-full border border-line bg-white px-2.5 py-1.5 text-xs font-semibold text-navy transition hover:border-navy focus:outline-none focus-visible:ring-2 focus-visible:ring-info/40"
    >
      {LANGS.map((code) => (
        <option key={code} value={code}>
          {t(`lang.${code}` as 'lang.en')}
        </option>
      ))}
    </select>
  )
}

function OfflineBanner() {
  const { t } = useI18n()
  const online = useOnline()
  if (online) return null
  return (
    <div className="no-print flex items-center justify-center gap-2 bg-warn-soft px-4 py-2 text-center text-xs font-medium text-warn">
      <WifiOff size={14} aria-hidden />
      <span>
        {t('offline.offline')} — {t('offline.offlineHint')}
      </span>
    </div>
  )
}

export default function AppShell({
  children,
  activePath,
}: {
  children: ReactNode
  activePath: string
}) {
  const { t, lang } = useI18n()
  const [menuOpen, setMenuOpen] = useState(false)
  const [inclusive, setInclusive] = useInclusiveMode()

  const isActive = (to: string) =>
    to === '/' ? activePath === '/' : activePath.startsWith(to)

  const confirmClear = () => {
    if (window.confirm(t('privacy.clearConfirm'))) {
      clearAllSahayakData()
      window.location.reload()
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-navy focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>

      <OfflineBanner />

      <header className="no-print sticky top-0 z-40 border-b border-line bg-ivory/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex items-center gap-2 font-display text-lg font-bold text-navy"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-navy text-white">
              <ShieldCheck size={18} aria-hidden />
            </span>
            <span className="hidden sm:inline">{t('app.name')}</span>
          </button>

          <nav className="ml-4 hidden items-center gap-1 md:flex" aria-label="Primary">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.to}
                type="button"
                onClick={() => navigate(item.to)}
                aria-current={isActive(item.to) ? 'page' : undefined}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  isActive(item.to)
                    ? 'bg-navy text-white'
                    : 'text-muted hover:bg-white hover:text-navy'
                }`}
              >
                {t(item.key)}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <LangSwitcher />
            <button
              type="button"
              onClick={() => setInclusive(!inclusive)}
              aria-pressed={inclusive}
              className={`hidden rounded-full border px-3 py-1.5 text-xs font-semibold sm:inline-flex ${
                inclusive
                  ? 'border-emerald bg-emerald-soft text-emerald'
                  : 'border-line bg-white text-muted hover:text-navy'
              }`}
              title={t('a11y.inclusive')}
            >
              {t('a11y.inclusive')}
            </button>
            <button
              type="button"
              className="rounded-full border border-line bg-white p-2 text-navy md:hidden"
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? t('nav.close') : t('nav.menu')}
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav
            className="border-t border-line bg-white px-4 py-3 md:hidden"
            aria-label="Mobile"
          >
            <div className="flex flex-col gap-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onClick={() => {
                    setMenuOpen(false)
                    navigate(item.to)
                  }}
                  className={`rounded-xl px-3 py-2.5 text-left text-sm font-medium ${
                    isActive(item.to) ? 'bg-navy text-white' : 'text-ink'
                  }`}
                >
                  {t(item.key)}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setInclusive(!inclusive)
                }}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink"
              >
                {t('a11y.inclusive')} — {inclusive ? 'on' : 'off'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  navigate('/admin')
                }}
                className="rounded-xl px-3 py-2.5 text-left text-sm font-medium text-ink"
              >
                {t('nav.admin')}
              </button>
            </div>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="no-print mt-16 border-t border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2 font-display text-base font-bold text-navy">
              <GraduationCap size={18} aria-hidden />
              {t('app.name')}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t('app.tagline')}</p>
            <p className="mt-3 text-xs leading-relaxed text-muted">{t('footer.disclaimer')}</p>
          </div>
          <div className="text-sm">
            <p className="font-semibold text-navy">{t('footer.about')}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{t('footer.sources')}</p>
            <p className="mt-2 text-xs leading-relaxed text-muted">{t('footer.notOfficial')}</p>
          </div>
          <div className="flex flex-col items-start gap-2 text-sm">
            <button type="button" className="text-navy underline-offset-4 hover:underline" onClick={() => navigate('/about')}>
              {t('nav.about')}
            </button>
            <button type="button" className="text-navy underline-offset-4 hover:underline" onClick={() => navigate('/admin')}>
              {t('nav.admin')}
            </button>
            <button type="button" className="text-danger underline-offset-4 hover:underline" onClick={confirmClear}>
              {t('privacy.clear')}
            </button>
            {speechSupported() && (
              <button
                type="button"
                className="text-muted underline-offset-4 hover:underline"
                onClick={() => speakText(t('app.description'), voiceTagFor(lang))}
              >
                {t('a11y.speak')}
              </button>
            )}
          </div>
        </div>
      </footer>

      <AssistantWidget />
    </div>
  )
}
