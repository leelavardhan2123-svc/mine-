import { Bookmark, Trash2 } from 'lucide-react'
import { EmptyState, LocalizedNote, OfficialLink, SectionHeading } from '../components/ui/index.tsx'
import { Card } from '../components/ui/index.tsx'
import { getScheme } from '../data/index.ts'
import { navigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { PASSPORT_STATUSES } from '../services/passport.ts'
import type { PassportStatus } from '../services/passport.ts'
import { actions, useAppState } from '../services/store.ts'

export default function PassportPage() {
  const { t, pick } = useI18n()
  const { passport, readyDocs } = useAppState()

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <SectionHeading title={t('passport.title')} subtitle={t('passport.subtitle')} />

      {passport.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={t('passport.empty')}
            body={t('passport.emptyHint')}
            action={
              <button type="button" className="btn btn-primary" onClick={() => navigate('/discover')}>
                {t('discover.title')}
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {passport.map((entry) => {
            const scheme = getScheme(entry.schemeId)
            if (!scheme) return null
            const docs = readyDocs[scheme.id] ?? []
            return (
              <Card key={entry.schemeId}>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <button
                      type="button"
                      className="text-left font-display text-lg font-semibold text-navy hover:underline"
                      onClick={() => navigate(`/scheme/${scheme.id}`)}
                    >
                      {pick(scheme.name)}
                    </button>
                    <p className="mt-0.5 text-xs text-muted">
                      {t('trust.lastVerified')}: <span className="font-mono">{scheme.lastVerified}</span>
                    </p>
                  </div>
                  <button
                    type="button"
                    className="btn btn-quiet btn-sm text-danger"
                    onClick={() => actions.removeFromPassport(entry.schemeId)}
                  >
                    <Trash2 size={14} aria-hidden />
                    {t('passport.remove')}
                  </button>
                </div>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="block text-xs font-semibold text-muted">
                    {t('passport.reason')}
                    <input
                      className="input mt-1"
                      value={entry.reason}
                      placeholder={t('passport.reasonPlaceholder')}
                      onChange={(event) =>
                        actions.updatePassportEntry(entry.schemeId, { reason: event.target.value })
                      }
                    />
                  </label>
                  <label className="block text-xs font-semibold text-muted">
                    {t('passport.status')}
                    <select
                      className="input mt-1"
                      value={entry.status}
                      onChange={(event) =>
                        actions.setPassportStatus(entry.schemeId, event.target.value as PassportStatus)
                      }
                    >
                      {PASSPORT_STATUSES.map((status) => (
                        <option key={status} value={status}>
                          {t(`passportStatus.${status}`)}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
                  <span className="pill pill-navy">
                    {docs.length}/{scheme.documents.length} {t('doc.ready')}
                  </span>
                  <button
                    type="button"
                    className="font-semibold text-navy hover:underline"
                    onClick={() => navigate(`/documents/${scheme.id}`)}
                  >
                    {t('scheme.docs')}
                  </button>
                  <button
                    type="button"
                    className="font-semibold text-navy hover:underline"
                    onClick={() => navigate(`/receipt/${scheme.id}`)}
                  >
                    {t('scheme.receipt')}
                  </button>
                  <span className="ml-auto">
                    <OfficialLink url={scheme.officialUrl} />
                  </span>
                </div>

                {scheme.benefits && (
                  <p className="mt-3 text-xs leading-relaxed text-muted">
                    <LocalizedNote value={scheme.benefits} />
                  </p>
                )}
              </Card>
            )
          })}
        </div>
      )}

      <div className="mt-6 flex items-start gap-2 text-xs leading-relaxed text-muted">
        <Bookmark size={14} className="mt-0.5 shrink-0" aria-hidden />
        <p>{t('passport.statusNote')}</p>
      </div>
    </div>
  )
}
