import { useMemo, useState } from 'react'
import { Activity, ArrowLeft, BadgeCheck, Check, ClipboardList, ExternalLink, FileCheck, Globe, PenLine, ShieldCheck } from 'lucide-react'
import { Callout, Card, OfficialLink, ProgressBar, SectionHeading } from '../components/ui/index.tsx'
import { getScheme } from '../data/index.ts'
import { navigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { buildRoadmap } from '../services/roadmap.ts'
import type { RoadmapStep } from '../services/roadmap.ts'

const STEP_ICONS: Record<string, typeof ClipboardList> = {
  documents: ClipboardList,
  eligibility: ShieldCheck,
  portal: Globe,
  fill: PenLine,
  review: BadgeCheck,
  acknowledgment: FileCheck,
  track: Activity,
}

export default function RoadmapPage({ schemeId }: { schemeId: string }) {
  const { t, pick } = useI18n()
  const scheme = getScheme(schemeId)
  const [done, setDone] = useState<Set<string>>(new Set())

  const steps = useMemo(() => (scheme ? buildRoadmap(scheme) : []), [scheme])

  if (!scheme) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-muted">{t('directory.empty')}</p>
      </div>
    )
  }

  const toggle = (id: string) => {
    setDone((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const doneCount = steps.filter((step) => done.has(step.id)).length

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <button
        type="button"
        className="btn btn-quiet btn-sm"
        onClick={() => navigate(`/scheme/${scheme.id}`)}
      >
        <ArrowLeft size={14} aria-hidden />
        {t('roadmap.backToScheme')}
      </button>

      <div className="mt-4">
        <SectionHeading title={t('roadmap.title')} subtitle={pick(scheme.name)} />
      </div>

      <p className="mt-3 text-sm leading-relaxed text-muted">{t('roadmap.intro')}</p>

      <div className="mt-4">
        <Callout tone="info">{t('roadmap.disclaimer')}</Callout>
      </div>

      <div className="mt-5 flex items-center gap-3">
        <div className="flex-1">
          <ProgressBar value={doneCount} max={steps.length} />
        </div>
        <span className="shrink-0 text-xs font-semibold text-muted">
          {t('roadmap.progress', { done: doneCount, total: steps.length })}
        </span>
      </div>

      <ol className="mt-6 space-y-4">
        {steps.map((step: RoadmapStep, index: number) => {
          const Icon = STEP_ICONS[step.id] ?? ClipboardList
          const isDone = done.has(step.id)
          const stepNumber = index + 1
          return (
            <li key={step.id} className="flex gap-3 sm:gap-4">
              <div className="flex w-10 shrink-0 flex-col items-center">
                <button
                  type="button"
                  aria-pressed={isDone}
                  aria-label={isDone ? t('roadmap.unmarkStep', { step: stepNumber }) : t('roadmap.markStep', { step: stepNumber })}
                  onClick={() => toggle(step.id)}
                  className={`grid size-10 place-items-center rounded-full border-2 text-sm font-bold transition ${
                    isDone
                      ? 'border-emerald bg-emerald text-white'
                      : 'border-line bg-white text-navy hover:border-navy'
                  }`}
                >
                  {isDone ? <Check size={18} aria-hidden /> : stepNumber}
                </button>
                {index < steps.length - 1 && <div className="mt-2 w-px flex-1 bg-line" aria-hidden />}
              </div>

              <Card className={`mb-1 flex-1 ${isDone ? 'opacity-75' : ''}`}>
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl ${
                      isDone ? 'bg-emerald-soft text-emerald' : 'bg-ivory-deep text-navy'
                    }`}
                  >
                    <Icon size={16} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-base font-semibold text-navy">
                      {stepNumber}. {pick(step.title)}
                    </h3>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-relaxed text-muted">
                      {pick(step.body)}
                    </p>
                    {step.items && step.items.length > 0 && (
                      <ul className="mt-3 space-y-2 border-t border-line pt-3">
                        {step.items.map((item) => (
                          <li key={item.label.en} className="flex gap-2 text-sm">
                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-saffron" aria-hidden />
                            <span>
                              <span className="font-medium text-ink">{pick(item.label)}</span>
                              {item.note && (
                                <span className="text-muted"> — {pick(item.note)}</span>
                              )}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {(step.internalHref || step.externalUrl) && (
                      <div className="mt-3 flex flex-wrap gap-3">
                        {step.internalHref && (
                          <a
                            href={step.internalHref}
                            className="inline-flex items-center gap-1.5 rounded-full bg-ivory px-3 py-1.5 text-xs font-semibold text-navy ring-1 ring-line hover:bg-white"
                          >
                            {step.internalLabel ? pick(step.internalLabel) : t('common.next')}
                          </a>
                        )}
                        {step.externalUrl && (
                          <OfficialLink url={step.externalUrl} label={step.externalUrl.replace(/^https?:\/\//, '').split('/')[0]} />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </li>
          )
        })}
      </ol>

      <div className="mt-6 flex justify-center">
        <button
          type="button"
          className="btn btn-outline"
          onClick={() => navigate(`/scheme/${scheme.id}`)}
        >
          <ExternalLink size={15} aria-hidden />
          {t('roadmap.backToScheme')}
        </button>
      </div>
    </div>
  )
}
