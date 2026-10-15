import { centralSchemes } from './schemes/central.ts'
import { stateSchemes } from './schemes/states.ts'
import type { CategoryId, Scheme } from './types.ts'

export const ALL_SCHEMES: Scheme[] = [...centralSchemes, ...stateSchemes]

export const ACTIVE_SCHEMES: Scheme[] = ALL_SCHEMES.filter(
  (scheme) => scheme.publication === 'published',
)

const schemeIndex = new Map(ALL_SCHEMES.map((scheme) => [scheme.id, scheme]))

export function getScheme(id: string): Scheme | undefined {
  return schemeIndex.get(id)
}

export function getSchemes(ids: string[]): Scheme[] {
  return ids
    .map((id) => schemeIndex.get(id))
    .filter((scheme): scheme is Scheme => Boolean(scheme))
}

export const CATEGORY_IDS: CategoryId[] = [
  'education',
  'agriculture',
  'employment',
  'women-family',
  'social-security',
  'entrepreneurship',
  'housing-services',
]

export function schemeMatchesSearch(scheme: Scheme, query: string): boolean {
  const needle = query.trim().toLowerCase()
  if (!needle) return true
  const haystack = [
    scheme.name.en,
    scheme.name.te ?? '',
    scheme.fullName.en,
    scheme.fullName.te ?? '',
    scheme.department.en,
    scheme.summary.en,
    scheme.summary.te ?? '',
    scheme.beneficiaries.en,
    scheme.categories.join(' '),
  ]
    .join(' ')
    .toLowerCase()
  return needle.split(/\s+/).every((word) => haystack.includes(word))
}

export type DirectorySort = 'relevance' | 'name' | 'recent'

export function filterSchemes(options: {
  query?: string
  categories?: CategoryId[]
  level?: 'central' | 'state' | 'all'
  state?: string
  sort?: DirectorySort
}): Scheme[] {
  const { query = '', categories = [], level = 'all', state, sort = 'relevance' } = options
  let schemes = ALL_SCHEMES.filter((scheme) => schemeMatchesSearch(scheme, query))
  if (categories.length > 0) {
    schemes = schemes.filter((scheme) =>
      scheme.categories.some((category) => categories.includes(category)),
    )
  }
  if (level !== 'all') schemes = schemes.filter((scheme) => scheme.level === level)
  if (state && state !== 'all') {
    schemes = schemes.filter(
      (scheme) => scheme.level === 'central' || scheme.state === state,
    )
  }
  if (sort === 'name') {
    schemes = [...schemes].sort((a, b) => a.name.en.localeCompare(b.name.en))
  } else if (sort === 'recent') {
    schemes = [...schemes].sort((a, b) => b.lastVerified.localeCompare(a.lastVerified))
  }
  return schemes
}

export function countByCategory(schemes: Scheme[]): Record<CategoryId, number> {
  const counts = {
    education: 0,
    agriculture: 0,
    employment: 0,
    'women-family': 0,
    'social-security': 0,
    entrepreneurship: 0,
    'housing-services': 0,
  } satisfies Record<CategoryId, number>
  for (const scheme of schemes) {
    for (const category of scheme.categories) counts[category] += 1
  }
  return counts
}
