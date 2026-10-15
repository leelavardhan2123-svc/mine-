import { useMemo, useState } from 'react'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { SchemeCard } from '../components/SchemeCard.tsx'
import { EmptyState, SectionHeading } from '../components/ui/index.tsx'
import { CATEGORY_IDS, filterSchemes } from '../data/index.ts'
import type { CategoryId } from '../data/types.ts'
import { STATE_CODES } from '../data/types.ts'
import { useHashRoute } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'

export default function DirectoryPage() {
  const { t } = useI18n()
  const { query } = useHashRoute()
  const [search, setSearch] = useState('')
  const [categories, setCategories] = useState<CategoryId[]>(() => {
    const initial = query.get('category')
    return initial ? [initial as CategoryId] : []
  })
  const [level, setLevel] = useState<'all' | 'central' | 'state'>('all')
  const [state, setState] = useState('all')
  const [sort, setSort] = useState<'relevance' | 'name' | 'recent'>('relevance')

  const schemes = useMemo(
    () => filterSchemes({ query: search, categories, level, state, sort }),
    [search, categories, level, state, sort],
  )

  const toggleCategory = (category: CategoryId) => {
    setCategories((current) =>
      current.includes(category)
        ? current.filter((entry) => entry !== category)
        : [...current, category],
    )
  }

  const clearAll = () => {
    setSearch('')
    setCategories([])
    setLevel('all')
    setState('all')
    setSort('relevance')
  }

  const filtersActive =
    search !== '' || categories.length > 0 || level !== 'all' || state !== 'all' || sort !== 'relevance'

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <SectionHeading title={t('directory.title')} subtitle={t('directory.subtitle')} />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[16rem] flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" aria-hidden />
          <input
            className="input pl-9"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('directory.search')}
            aria-label={t('directory.search')}
          />
        </div>
        {filtersActive && (
          <button type="button" className="btn btn-quiet btn-sm" onClick={clearAll}>
            <X size={14} aria-hidden />
            {t('directory.clearFilters')}
          </button>
        )}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-white p-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
          <SlidersHorizontal size={13} aria-hidden />
          {t('directory.filters')}
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <select className="input !w-auto" value={level} onChange={(e) => setLevel(e.target.value as 'all' | 'central' | 'state')} aria-label={t('directory.level')}>
            <option value="all">{t('directory.levelAll')}</option>
            <option value="central">{t('directory.levelCentral')}</option>
            <option value="state">{t('directory.levelState')}</option>
          </select>
          <select className="input !w-auto" value={state} onChange={(e) => setState(e.target.value)} aria-label={t('directory.state')}>
            <option value="all">{t('directory.stateAll')}</option>
            {STATE_CODES.map((code) => (
              <option key={code} value={code}>
                {t(`states.${code}` as 'states.AP')}
              </option>
            ))}
          </select>
          <select className="input !w-auto" value={sort} onChange={(e) => setSort(e.target.value as 'relevance' | 'name' | 'recent')} aria-label={t('directory.sort')}>
            <option value="relevance">{t('directory.sortRelevance')}</option>
            <option value="name">{t('directory.sortName')}</option>
            <option value="recent">{t('directory.sortRecent')}</option>
          </select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORY_IDS.map((category) => (
            <button
              key={category}
              type="button"
              aria-pressed={categories.includes(category)}
              onClick={() => toggleCategory(category)}
              className={`pill ${categories.includes(category) ? 'pill-navy' : 'pill-muted'}`}
            >
              {t(`category.${category}`)}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted">
        {schemes.length} {t('directory.results')}
      </p>

      {schemes.length === 0 ? (
        <div className="mt-4">
          <EmptyState
            title={t('directory.empty')}
            body={t('directory.emptyHint')}
            action={
              <button type="button" className="btn btn-outline btn-sm" onClick={clearAll}>
                {t('directory.showAll')}
              </button>
            }
          />
        </div>
      ) : (
        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schemes.map((scheme) => (
            <SchemeCard key={scheme.id} scheme={scheme} />
          ))}
        </div>
      )}
    </div>
  )
}
