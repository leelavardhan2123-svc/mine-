import { useI18n } from '../i18n/useI18n.ts'
import type { Scheme } from '../data/types.ts'
import { CategoryPill, TrustPill } from './ui/index.tsx'
import { navigate } from '../hooks/useHashRoute.ts'

export function SchemeCard({
  scheme,
  footer,
}: {
  scheme: Scheme
  footer?: React.ReactNode
}) {
  const { pick, t } = useI18n()
  return (
    <article className="card flex flex-col p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted">
            {scheme.level === 'central' ? t('scheme.level.central') : t('scheme.level.state')}
            {scheme.state ? ` · ${t(`states.${scheme.state}` as 'states.AP')}` : ''}
          </p>
          <button
            type="button"
            onClick={() => navigate(`/scheme/${scheme.id}`)}
            className="mt-1 block text-left font-display text-lg font-semibold leading-snug text-navy hover:underline"
          >
            {pick(scheme.name)}
          </button>
        </div>
        <TrustPill status={scheme.verification} />
      </div>
      <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-muted">
        {pick(scheme.summary)}
      </p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {scheme.categories.map((category) => (
          <CategoryPill key={category} category={category} />
        ))}
      </div>
      {footer && <div className="mt-4 border-t border-line pt-3">{footer}</div>}
    </article>
  )
}
