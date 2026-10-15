import { ArrowLeft, CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import { Callout, Card, LocalizedNote, SectionHeading } from '../components/ui/index.tsx'
import { getDocument } from '../data/documents.ts'
import { getScheme } from '../data/index.ts'
import { navigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { actions, useAppState } from '../services/store.ts'

export default function DocumentsPage({ schemeId }: { schemeId: string }) {
  const { t, pick } = useI18n()
  const scheme = getScheme(schemeId)
  const readyDocs = useAppState().readyDocs[schemeId] ?? []

  if (!scheme) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-muted">{t('directory.empty')}</p>
      </div>
    )
  }

  const required = scheme.documents.filter((doc) => doc.requirement === 'required')
  const readyRequired = required.filter((doc) => readyDocs.includes(doc.docId))

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <button type="button" className="btn btn-quiet btn-sm" onClick={() => navigate(`/scheme/${scheme.id}`)}>
        <ArrowLeft size={14} aria-hidden />
        {pick(scheme.name)}
      </button>

      <div className="mt-4">
        <SectionHeading title={t('doc.readiness')} subtitle={pick(scheme.name)} />
      </div>

      <Card className="mt-6">
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-navy">
            {t('doc.progress', { ready: readyRequired.length, total: required.length })}
          </p>
          <span className="pill pill-navy">
            {readyDocs.length}/{scheme.documents.length}
          </span>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-ivory-deep">
          <div
            className="h-full rounded-full bg-emerald transition-all"
            style={{
              width: `${required.length === 0 ? 100 : Math.round((readyRequired.length / required.length) * 100)}%`,
            }}
          />
        </div>
      </Card>

      <div className="mt-4 space-y-3">
        {scheme.documents.map((doc) => {
          const catalog = getDocument(doc.docId)
          const ready = readyDocs.includes(doc.docId)
          return (
            <Card key={doc.docId} className="!p-4">
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => actions.toggleReadyDoc(scheme.id, doc.docId)}
                  aria-pressed={ready}
                  className={`mt-0.5 shrink-0 ${ready ? 'text-emerald' : 'text-muted'}`}
                >
                  {ready ? <CheckCircle2 size={22} /> : <Circle size={22} />}
                </button>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-navy">
                      {catalog ? pick(catalog.name) : doc.docId}
                    </p>
                    <span
                      className={`pill ${
                        doc.requirement === 'required'
                          ? 'pill-danger'
                          : doc.requirement === 'often-needed'
                            ? 'pill-saffron'
                            : 'pill-muted'
                      }`}
                    >
                      {t(`doc.${doc.requirement}`)}
                    </span>
                    <span className={`pill ${ready ? 'pill-emerald' : 'pill-muted'}`}>
                      {ready ? t('doc.ready') : t('doc.missing')}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    {catalog ? <LocalizedNote value={catalog.purpose} /> : null}
                  </p>
                  {doc.note && (
                    <p className="mt-1 text-xs text-muted">
                      <LocalizedNote value={doc.note} />
                    </p>
                  )}
                  {catalog?.obtainVia && (
                    <p className="mt-1 text-xs text-muted">
                      {t('doc.purpose')}: <LocalizedNote value={catalog.obtainVia} />
                    </p>
                  )}
                  {catalog?.officialInfoUrl && (
                    <a
                      href={catalog.officialInfoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-info hover:underline"
                    >
                      <ExternalLink size={12} aria-hidden />
                      {t('doc.officialInfo')}
                    </a>
                  )}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <div className="mt-5 space-y-3">
        <Callout tone="info">{t('doc.noUpload')}</Callout>
        <Callout tone="warn">{t('doc.uncertainty')}</Callout>
      </div>
    </div>
  )
}
