import { useEffect, useMemo } from 'react'
import { ArrowLeft, Printer, ShieldAlert } from 'lucide-react'
import { Callout, Card, LocalizedNote, OfficialLink, SpeakButton, StatusPill, TrustPill } from '../components/ui/index.tsx'
import { getScheme } from '../data/index.ts'
import { getDocument } from '../data/documents.ts'
import { assessScheme } from '../engine/eligibility.ts'
import { goBack, navigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { actions, useAppState } from '../services/store.ts'

export default function ReceiptPage({ schemeId }: { schemeId: string }) {
  const { t, pick } = useI18n()
  const scheme = getScheme(schemeId)
  const answers = useAppState().answers

  useEffect(() => {
    actions.recordReceipt()
  }, [])

  const assessment = useMemo(() => {
    if (!scheme || !answers) return null
    return assessScheme(scheme, answers)
  }, [scheme, answers])

  if (!scheme || !assessment) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Callout tone="warn" title={t('results.none')}>
          {t('results.noneHint')}
        </Callout>
        <button type="button" className="btn btn-primary mt-4" onClick={() => navigate('/discover')}>
          {t('discover.title')}
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="no-print flex items-center justify-between">
        <button type="button" className="btn btn-quiet btn-sm" onClick={() => goBack('/directory')}>
          <ArrowLeft size={14} aria-hidden />
          {t('common.back')}
        </button>
        <button type="button" className="btn btn-outline btn-sm" onClick={() => window.print()}>
          <Printer size={14} aria-hidden />
          {t('receipt.print')}
        </button>
      </div>

      <Card className="mt-4">
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line pb-4">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-muted">
              {t('receipt.title')}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold">{pick(scheme.name)}</h1>
            <p className="text-sm text-muted">{pick(scheme.fullName)}</p>
          </div>
          <div className="text-right">
            <StatusPill status={assessment.status} />
            <p className="mt-2">
              <TrustPill status={scheme.verification} />
            </p>
          </div>
        </div>

        <div className="py-4">
          <Callout tone="warn" title={t('receipt.preliminary')}>
            <p className="mt-1">{t(`status.help.${assessment.status}`)}</p>
          </Callout>
        </div>

        <section className="rule-dashed py-4">
          <h2 className="font-display text-base font-semibold">{t('receipt.why')}</h2>
          <ul className="mt-2 space-y-1.5 text-sm leading-relaxed text-muted">
            <li>
              <LocalizedNote value={scheme.beneficiaries} />
            </li>
            <li>
              <LocalizedNote value={scheme.summary} />
            </li>
            {assessment.notes.map((note, index) => (
              <li key={index}>
                <LocalizedNote value={note} />
              </li>
            ))}
          </ul>
        </section>

        <section className="rule-dashed py-4">
          <h2 className="font-display text-base font-semibold">{t('receipt.matched')}</h2>
          {assessment.matched.length === 0 ? (
            <p className="mt-2 text-sm text-muted">{t('receipt.noneMatched')}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {assessment.matched.map((result) => (
                <li key={result.rule.id} className="flex gap-2 text-sm leading-relaxed">
                  <span className="mt-0.5 text-emerald" aria-hidden>✓</span>
                  <span className="text-muted">
                    <LocalizedNote value={result.rule.explain} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rule-dashed py-4">
          <h2 className="font-display text-base font-semibold">{t('receipt.checking')}</h2>
          {assessment.failed.length === 0 && assessment.unknown.length === 0 ? (
            <p className="mt-2 text-sm text-muted">{t('receipt.noneUnknown')}</p>
          ) : (
            <ul className="mt-2 space-y-2">
              {[...assessment.failed, ...assessment.unknown].map((result) => (
                <li key={result.rule.id} className="flex gap-2 text-sm leading-relaxed">
                  <span className="mt-0.5 shrink-0 text-warn" aria-hidden>
                    {result.outcome === 'fail' ? '✕' : '?'}
                  </span>
                  <span className="text-muted">
                    <LocalizedNote value={result.rule.explain} />
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="rule-dashed py-4">
          <h2 className="font-display text-base font-semibold">{t('receipt.documents')}</h2>
          <ul className="mt-2 space-y-1.5 text-sm text-muted">
            {scheme.documents.map((doc) => (
              <li key={doc.docId} className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-[11px] uppercase">{t(`doc.${doc.requirement}`)}</span>
                <span>{pick(getDocument(doc.docId)?.name ?? { en: doc.docId })}</span>
                {doc.note && <span className="text-xs">— <LocalizedNote value={doc.note} /></span>}
              </li>
            ))}
          </ul>
          <button
            type="button"
            className="btn btn-outline btn-sm mt-3 no-print"
            onClick={() => navigate(`/documents/${scheme.id}`)}
          >
            {t('doc.readiness')}
          </button>
        </section>

        <section className="rule-dashed py-4">
          <h2 className="font-display text-base font-semibold">{t('receipt.next')}</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            <LocalizedNote value={scheme.application} />
          </p>
          <div className="mt-2">
            <OfficialLink url={scheme.officialUrl} />
          </div>
        </section>

        <section className="rule-dashed py-4">
          <h2 className="font-display text-base font-semibold">{t('receipt.source')}</h2>
          <p className="mt-1 break-all text-sm text-info">{scheme.officialUrl}</p>
          <p className="mt-1 text-xs text-muted">
            {t('trust.lastVerified')}: <span className="font-mono">{scheme.lastVerified}</span>
          </p>
          {scheme.otherUrls?.map((other) => (
            <p key={other.url} className="mt-1">
              <OfficialLink url={other.url} label={other.label} />
            </p>
          ))}
          <div className="mt-3 flex items-start gap-2 text-xs text-muted">
            <ShieldAlert size={14} className="mt-0.5 shrink-0" aria-hidden />
            <span>{t('receipt.noPersonal')}</span>
          </div>
        </section>
      </Card>

      <div className="no-print mt-4 flex flex-wrap items-center gap-3">
        <SpeakButton text={`${pick(scheme.name)}. ${t('receipt.preliminary')}`} />
        <p className="text-xs text-muted">{t('footer.notOfficial')}</p>
      </div>
    </div>
  )
}
