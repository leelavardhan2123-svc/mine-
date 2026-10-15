import { useMemo } from 'react'
import { ArrowRight, Layers, Search } from 'lucide-react'
import { SchemeCard } from '../components/SchemeCard.tsx'
import { Callout, EmptyState, RadarPill, SectionHeading, SpeakButton } from '../components/ui/index.tsx'
import { ACTIVE_SCHEMES } from '../data/index.ts'
import { assessAll, sortAssessments } from '../engine/eligibility.ts'
import type { RadarGroup } from '../data/types.ts'
import { navigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import type { MessageKey } from '../i18n/en.ts'
import { useAppState } from '../services/store.ts'

const GROUPS: { id: RadarGroup; titleKey: MessageKey; descKey: MessageKey }[] = [
  { id: 'strong', titleKey: 'radar.strong.title', descKey: 'radar.strong.desc' },
  { id: 'possible', titleKey: 'radar.possible.title', descKey: 'radar.possible.desc' },
  { id: 'needs-info', titleKey: 'radar.needsInfo.title', descKey: 'radar.needsInfo.desc' },
  { id: 'not-matching', titleKey: 'radar.notMatching.title', descKey: 'radar.notMatching.desc' },
]

export default function ResultsPage() {
  const { t } = useI18n()
  const answers = useAppState().answers

  const assessments = useMemo(() => {
    if (!answers) return []
    return sortAssessments(assessAll(ACTIVE_SCHEMES, answers))
  }, [answers])

  if (!answers) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title={t('results.none')}
          body={t('results.noneHint')}
          action={
            <button type="button" className="btn btn-primary" onClick={() => navigate('/discover')}>
              {t('discover.title')}
            </button>
          }
        />
      </div>
    )
  }

  const grouped = GROUPS.map((group) => ({
    ...group,
    items: assessments.filter((assessment) => assessment.radar === group.id),
  }))

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <SectionHeading title={t('results.title')} subtitle={t('results.subtitle')} />
        <div className="no-print flex gap-2">
          <button type="button" className="btn btn-outline btn-sm" onClick={() => navigate('/discover')}>
            {t('results.rerun')}
          </button>
          <button type="button" className="btn btn-quiet btn-sm" onClick={() => navigate('/directory')}>
            <Search size={14} aria-hidden />
            {t('nav.directory')}
          </button>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {GROUPS.map((group) => (
          <button
            key={group.id}
            type="button"
            className="inline-flex items-center gap-1.5"
            onClick={() => {
              document.getElementById(`radar-${group.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
          >
            <RadarPill group={group.id} />
            <span className="text-xs font-semibold text-muted">
              {assessments.filter((a) => a.radar === group.id).length}
            </span>
          </button>
        ))}
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted">
          <Layers size={13} aria-hidden />
          {assessments.length} {t('directory.results')}
        </span>
      </div>

      <div className="mt-8 space-y-10">
        {grouped.map((group) => (
          <section key={group.id} id={`radar-${group.id}`} className="scroll-mt-24">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-display text-xl font-bold">{t(group.titleKey)}</h2>
              <RadarPill group={group.id} />
              {group.id === 'strong' && <SpeakButton text={`${t('radar.strong.title')}. ${t('radar.strong.desc')}`} />}
            </div>
            <p className="mt-1 text-sm text-muted">{t(group.descKey)}</p>

            {group.items.length === 0 ? (
              <p className="mt-3 text-sm text-muted">—</p>
            ) : (
              <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {group.items.map((assessment) => {
                  const scheme = ACTIVE_SCHEMES.find((entry) => entry.id === assessment.schemeId)!
                  return (
                    <SchemeCard
                      key={assessment.schemeId}
                      scheme={scheme}
                      footer={
                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
                          <span>{assessment.matched.length} ✓</span>
                          <span>{assessment.failed.length} ✕</span>
                          <span>{assessment.unknown.length} ?</span>
                          <button
                            type="button"
                            className="ml-auto inline-flex items-center gap-1 font-semibold text-navy hover:underline"
                            onClick={() => navigate(`/receipt/${scheme.id}`)}
                          >
                            {t('scheme.receipt')}
                            <ArrowRight size={13} aria-hidden />
                          </button>
                        </div>
                      }
                    />
                  )
                })}
              </div>
            )}
          </section>
        ))}
      </div>

      <div className="mt-10">
        <Callout tone="warn" title={t('footer.notOfficial')}>
          {t('status.help.likely')}
        </Callout>
      </div>
    </div>
  )
}
