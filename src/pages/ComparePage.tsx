import { useMemo } from 'react'
import { X } from 'lucide-react'
import { Card, SectionHeading, StatusPill } from '../components/ui/index.tsx'
import { ALL_SCHEMES, getScheme } from '../data/index.ts'
import { assessScheme } from '../engine/eligibility.ts'
import { navigate, useHashRoute } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { useAppState } from '../services/store.ts'

export default function ComparePage() {
  const { t, pick } = useI18n()
  const { query } = useHashRoute()
  const answers = useAppState().answers
  const a = query.get('a') ?? ''
  const b = query.get('b') ?? ''

  const schemeA = getScheme(a)
  const schemeB = getScheme(b)

  const rows = useMemo(() => {
    if (!schemeA || !schemeB) return []
    const assessA = answers ? assessScheme(schemeA, answers) : null
    const assessB = answers ? assessScheme(schemeB, answers) : null
    return [
      { label: t('scheme.level.central'), a: schemeA.level === 'central' ? t('scheme.level.central') : t('scheme.level.state'), b: schemeB.level === 'central' ? t('scheme.level.central') : t('scheme.level.state') },
      { label: t('scheme.department'), a: pick(schemeA.department), b: pick(schemeB.department) },
      { label: t('scheme.eligibility'), a: pick(schemeA.eligibilityText), b: pick(schemeB.eligibilityText), long: true },
      { label: t('scheme.benefits'), a: pick(schemeA.benefits), b: pick(schemeB.benefits), long: true },
      { label: t('receipt.documents'), a: schemeA.documents.map((d) => d.docId).join(', '), b: schemeB.documents.map((d) => d.docId).join(', '), long: true },
      {
        label: t('results.title'),
        a: assessA ? t(`status.${assessA.status}`) : t('common.unknown'),
        b: assessB ? t(`status.${assessB.status}`) : t('common.unknown'),
        status: true,
      },
      { label: t('trust.lastVerified'), a: schemeA.lastVerified, b: schemeB.lastVerified },
    ]
  }, [schemeA, schemeB, answers, t, pick])

  const selectScheme = (slot: 'a' | 'b', id: string) => {
    const params = new URLSearchParams(window.location.hash.split('?')[1] ?? '')
    if (id) params.set(slot, id)
    else params.delete(slot)
    const qs = params.toString()
    navigate(`/compare${qs ? `?${qs}` : ''}`)
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <SectionHeading title={t('compare.title')} subtitle={t('compare.pick')} />

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {(['a', 'b'] as const).map((slot) => (
          <label key={slot} className="block text-xs font-semibold text-muted">
            {slot === 'a' ? t('compare.selectA') : t('compare.selectB')}
            <select
              className="input mt-1"
              value={slot === 'a' ? a : b}
              onChange={(event) => selectScheme(slot, event.target.value)}
            >
              <option value="">—</option>
              {ALL_SCHEMES.map((scheme) => (
                <option key={scheme.id} value={scheme.id}>
                  {scheme.name.en}
                </option>
              ))}
            </select>
          </label>
        ))}
      </div>

      {!schemeA || !schemeB ? (
        <Card className="mt-6">
          <p className="text-sm text-muted">{t('compare.pick')}</p>
        </Card>
      ) : (
        <Card className="mt-6 !p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[40rem] text-left text-sm">
              <thead>
                <tr className="border-b border-line">
                  <th className="px-4 py-3 font-display text-xs uppercase tracking-wide text-muted">{t('compare.criterion')}</th>
                  <th className="px-4 py-3 font-display text-sm font-semibold text-navy">{pick(schemeA.name)}</th>
                  <th className="px-4 py-3 font-display text-sm font-semibold text-navy">{pick(schemeB.name)}</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-b border-line last:border-0 align-top">
                    <td className="px-4 py-3 font-semibold text-navy">{row.label}</td>
                    <td className={`px-4 py-3 text-muted ${row.long ? 'text-xs leading-relaxed' : ''}`}>{row.a}</td>
                    <td className={`px-4 py-3 text-muted ${row.long ? 'text-xs leading-relaxed' : ''}`}>{row.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {answers && schemeA && schemeB && (
        <div className="mt-4 flex flex-wrap gap-2">
          <StatusPill status={assessScheme(schemeA, answers).status} />
          <X size={14} className="text-muted" aria-hidden />
          <StatusPill status={assessScheme(schemeB, answers).status} />
        </div>
      )}
    </div>
  )
}
