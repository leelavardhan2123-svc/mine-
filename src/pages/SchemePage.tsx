import { useMemo } from 'react'
import { ArrowLeft, Bookmark, BookmarkCheck, FileText, Receipt, Scale } from 'lucide-react'
import { Callout, CategoryPill, LocalizedNote, OfficialLink, SectionHeading, SpeakButton, StatusPill, TrustPill, Card } from '../components/ui/index.tsx'
import { getScheme } from '../data/index.ts'
import { assessScheme } from '../engine/eligibility.ts'
import { navigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { actions, useAppState } from '../services/store.ts'

export default function SchemePage({ schemeId }: { schemeId: string }) {
  const { t, pick } = useI18n()
  const scheme = getScheme(schemeId)
  const { answers, passport } = useAppState()

  const assessment = useMemo(() => {
    if (!scheme || !answers) return null
    return assessScheme(scheme, answers)
  }, [scheme, answers])

  if (!scheme) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-muted">{t('directory.empty')}</p>
      </div>
    )
  }

  const saved = passport.some((entry) => entry.schemeId === scheme.id)

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <button type="button" className="btn btn-quiet btn-sm no-print" onClick={() => navigate('/directory')}>
        <ArrowLeft size={14} aria-hidden />
        {t('nav.directory')}
      </button>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="pill pill-navy">
          {scheme.level === 'central' ? t('scheme.level.central') : t('scheme.level.state')}
        </span>
        <TrustPill status={scheme.verification} />
        {scheme.categories.map((category) => (
          <CategoryPill key={category} category={category} />
        ))}
      </div>

      <SectionHeading title={pick(scheme.name)} subtitle={pick(scheme.fullName)} />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <OfficialLink url={scheme.officialUrl} label={`${scheme.officialUrl.replace(/^https?:\/\//, '').split('/')[0]}`} />
        <SpeakButton text={`${pick(scheme.name)}. ${pick(scheme.summary)}`} />
      </div>

      {scheme.publication === 'archived' && (
        <div className="mt-4">
          <Callout tone="danger" title={t('trust.archived')}>
            <LocalizedNote value={scheme.archivedNote ?? scheme.knownUncertainty} />
          </Callout>
        </div>
      )}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t('scheme.department')}</p>
          <p className="mt-1 text-sm font-medium text-navy">
            <LocalizedNote value={scheme.department} />
          </p>
          <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">{t('scheme.beneficiaries')}</p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            <LocalizedNote value={scheme.beneficiaries} />
          </p>
        </Card>
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{t('receipt.source')}</p>
          <p className="mt-1 break-all text-sm text-info">{scheme.officialUrl}</p>
          <p className="mt-3 text-xs text-muted">
            {t('trust.lastVerified')}: <span className="font-mono">{scheme.lastVerified}</span>
          </p>
          {!scheme.benefitsVerified && (
            <p className="mt-2 text-xs font-semibold text-warn">{t('trust.benefitsUnverified')}</p>
          )}
        </Card>
      </div>

      <div className="mt-4 space-y-4">
        <Card>
          <h3 className="font-display text-lg font-semibold">{t('scheme.eligibility')}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <LocalizedNote value={scheme.eligibilityText} />
          </p>
          {assessment && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-muted">{t('results.title')}:</span>
              <StatusPill status={assessment.status} />
            </div>
          )}
        </Card>

        <Card>
          <h3 className="font-display text-lg font-semibold">{t('scheme.benefits')}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <LocalizedNote value={scheme.benefits} />
          </p>
        </Card>

        <Card>
          <h3 className="font-display text-lg font-semibold">{t('scheme.application')}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <LocalizedNote value={scheme.application} />
          </p>
        </Card>

        {scheme.knownUncertainty && (
          <Callout tone="warn" title={t('trust.uncertainty')}>
            <LocalizedNote value={scheme.knownUncertainty} />
          </Callout>
        )}

        {scheme.verificationNote && (
          <Callout tone="info" title={t('trust.verificationNote')}>
            <LocalizedNote value={scheme.verificationNote} />
          </Callout>
        )}
      </div>

      <div className="no-print mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          className={`btn ${saved ? 'btn-outline' : 'btn-primary'}`}
          onClick={() => {
            if (saved) actions.removeFromPassport(scheme.id)
            else actions.saveToPassport(scheme.id)
          }}
        >
          {saved ? <BookmarkCheck size={16} /> : <Bookmark size={16} />}
          {saved ? t('scheme.unsave') : t('scheme.save')}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => navigate(`/documents/${scheme.id}`)}>
          <FileText size={16} aria-hidden />
          {t('scheme.docs')}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => navigate(`/receipt/${scheme.id}`)}>
          <Receipt size={16} aria-hidden />
          {t('scheme.receipt')}
        </button>
        <button type="button" className="btn btn-outline" onClick={() => navigate(`/compare?a=${scheme.id}`)}>
          <Scale size={16} aria-hidden />
          {t('scheme.compare')}
        </button>
        <button type="button" className="btn btn-quiet" onClick={() => navigate(`/ask/${scheme.id}`)}>
          {t('scheme.askAI')}
        </button>
      </div>
    </div>
  )
}
