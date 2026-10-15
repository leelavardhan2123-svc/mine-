import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Info,
  Volume2,
} from 'lucide-react'
import type {
  CategoryId,
  EligibilityStatus,
  Localized,
  RadarGroup,
  VerificationStatus,
} from '../../data/types.ts'
import { useI18n } from '../../i18n/useI18n.ts'
import { speakText, voiceTagFor } from '../../services/speech.ts'

export function Card({
  children,
  className = '',
  as: Tag = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
}) {
  return <Tag className={`card p-5 sm:p-6 ${className}`}>{children}</Tag>
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && (
        <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-saffron-deep">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-1 font-display text-2xl font-bold sm:text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p>}
    </div>
  )
}

export function Callout({
  tone = 'info',
  title,
  children,
}: {
  tone?: 'info' | 'warn' | 'danger' | 'emerald'
  title?: string
  children: ReactNode
}) {
  const styles = {
    info: { cls: 'border-info/25 bg-info-soft text-info', Icon: Info },
    warn: { cls: 'border-warn/25 bg-warn-soft text-warn', Icon: AlertTriangle },
    danger: { cls: 'border-danger/25 bg-danger-soft text-danger', Icon: AlertTriangle },
    emerald: { cls: 'border-emerald/25 bg-emerald-soft text-emerald', Icon: CheckCircle2 },
  }[tone]
  const { Icon } = styles
  return (
    <div className={`rounded-2xl border px-4 py-3 text-sm leading-relaxed ${styles.cls}`}>
      <div className="flex gap-2">
        <Icon size={16} className="mt-0.5 shrink-0" aria-hidden />
        <div>
          {title && <p className="font-semibold">{title}</p>}
          <div className={title ? 'mt-1' : ''}>{children}</div>
        </div>
      </div>
    </div>
  )
}

export function StatusPill({ status }: { status: EligibilityStatus }) {
  const { t } = useI18n()
  const tone =
    status === 'likely'
      ? 'pill-emerald'
      : status === 'potential'
        ? 'pill-saffron'
        : status === 'insufficient'
          ? 'pill-warn'
          : 'pill-muted'
  return <span className={`pill ${tone}`}>{t(`status.${status}`)}</span>
}

export function RadarPill({ group }: { group: RadarGroup }) {
  const { t } = useI18n()
  const map = {
    strong: { cls: 'pill-emerald', key: 'radar.strong.title' },
    possible: { cls: 'pill-saffron', key: 'radar.possible.title' },
    'needs-info': { cls: 'pill-warn', key: 'radar.needsInfo.title' },
    'not-matching': { cls: 'pill-muted', key: 'radar.notMatching.title' },
  } as const
  return <span className={`pill ${map[group].cls}`}>{t(map[group].key)}</span>
}

export function TrustPill({ status }: { status: VerificationStatus }) {
  const { t } = useI18n()
  const tone =
    status === 'verified'
      ? 'pill-emerald'
      : status === 'needs-reverification'
        ? 'pill-warn'
        : status === 'archived'
          ? 'pill-danger'
          : 'pill-muted'
  return <span className={`pill ${tone}`}>{t(`trust.${status}`)}</span>
}

export function CategoryPill({ category }: { category: CategoryId }) {
  const { t } = useI18n()
  return <span className="pill pill-navy">{t(`category.${category}`)}</span>
}

export function OfficialLink({
  url,
  label,
}: {
  url: string
  label?: string
}) {
  const { t } = useI18n()
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 text-sm font-semibold text-info underline-offset-4 hover:underline"
    >
      <ExternalLink size={14} aria-hidden />
      {label ?? t('common.openOfficial')}
    </a>
  )
}

export function SpeakButton({ text, label }: { text: string; label?: string }) {
  const { t, lang } = useI18n()
  return (
    <button
      type="button"
      onClick={() => speakText(text, voiceTagFor(lang))}
      className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-2.5 py-1 text-xs font-semibold text-muted transition hover:text-navy"
      title={t('a11y.listen')}
    >
      <Volume2 size={13} aria-hidden />
      {label ?? t('a11y.listen')}
    </button>
  )
}

export function LocalizedNote({
  value,
  showFallbackMarker = true,
}: {
  value: Localized | undefined
  showFallbackMarker?: boolean
}) {
  const { pick, lang, t } = useI18n()
  if (!value) return null
  const text = pick(value)
  return (
    <span>
      {text}
      {showFallbackMarker && lang === 'te' && !value.te && (
        <span className="ml-1 text-xs text-muted">({t('common.needsTranslation')})</span>
      )}
    </span>
  )
}

export function Disclosure({
  summary,
  children,
  defaultOpen = false,
}: {
  summary: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl border border-line bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-sm font-semibold text-navy"
      >
        {summary}
        {open ? <ChevronUp size={16} aria-hidden /> : <ChevronDown size={16} aria-hidden />}
      </button>
      {open && <div className="px-4 pb-4 text-sm leading-relaxed text-muted">{children}</div>}
    </div>
  )
}

export function ProgressBar({ value, max }: { value: number; max: number }) {
  const pct = max <= 0 ? 0 : Math.min(100, Math.round((value / max) * 100))
  return (
    <div
      className="h-2 w-full overflow-hidden rounded-full bg-ivory-deep"
      role="progressbar"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="h-full rounded-full bg-navy transition-all duration-300" style={{ width: `${pct}%` }} />
    </div>
  )
}

export function EmptyState({
  title,
  body,
  action,
}: {
  title: string
  body?: string
  action?: ReactNode
}) {
  return (
    <div className="card-flat flex flex-col items-center gap-3 px-6 py-12 text-center">
      <div className="grid size-12 place-items-center rounded-full bg-ivory-deep text-navy">
        <Info size={20} aria-hidden />
      </div>
      <p className="font-display text-lg font-semibold text-navy">{title}</p>
      {body && <p className="max-w-md text-sm text-muted">{body}</p>}
      {action}
    </div>
  )
}
