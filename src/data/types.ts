export const STATE_CODES = [
  'AN', 'AP', 'AR', 'AS', 'BR', 'CH', 'CG', 'DH', 'GA', 'GJ', 'HR', 'HP', 'JH',
  'JK', 'KA', 'KL', 'LA', 'LD', 'MP', 'MH', 'MN', 'ML', 'MZ', 'NL', 'OD', 'PB',
  'PY', 'RJ', 'SK', 'TN', 'TG', 'TR', 'UP', 'UK', 'WB', 'OTHER',
] as const

export type StateCode = (typeof STATE_CODES)[number]

export type CategoryId =
  | 'education'
  | 'agriculture'
  | 'employment'
  | 'women-family'
  | 'social-security'
  | 'entrepreneurship'
  | 'housing-services'

export type VerificationStatus =
  | 'verified'
  | 'needs-reverification'
  | 'incomplete'
  | 'archived'

export type PublicationStatus = 'published' | 'draft' | 'archived'

export type Localized = { en: string; te?: string }

export type Gender = 'female' | 'male' | 'other'

export type SocialCategory = 'sc' | 'st' | 'obc' | 'general' | 'minority'

export const EDUCATION_LEVELS = [
  'no-formal-schooling',
  'primary',
  'middle',
  'secondary',
  'higher-secondary',
  'iti-diploma',
  'graduate',
  'post-graduate',
] as const

export type EducationLevel = (typeof EDUCATION_LEVELS)[number]

export const OCCUPATIONS = [
  'farmer-owner',
  'farmer-tenant',
  'agricultural-labourer',
  'artisan',
  'student',
  'salaried-private',
  'government-employee',
  'self-employed-business',
  'street-vendor',
  'homemaker',
  'retired-senior',
  'unemployed',
  'other',
] as const

export type OccupationId = (typeof OCCUPATIONS)[number]

export const INCOME_BANDS = [
  'under-1l',
  '1l-2.5l',
  '2.5l-5l',
  '5l-8l',
  '8l-10l',
  'above-10l',
] as const

export type IncomeBand = (typeof INCOME_BANDS)[number]

export type AttributeKey =
  | 'landholding-acres'
  | 'bank-account'
  | 'disability-percent'
  | 'disability-certificate'
  | 'has-pucca-house'
  | 'shg-member'
  | 'street-vendor'
  | 'pregnant'
  | 'girl-child-under-10'
  | 'unorganised-worker'
  | 'govt-employee'
  | 'income-tax-payer'
  | 'business-year-old'
  | 'enterprise-investment-lakhs'
  | 'first-generation-entrepreneur'
  | 'minority-community'
  | 'homeless-vending'
  | 'secc-listed'
  | 'kisan-credit-existing'

export type AttributeValue = string | number | boolean

export type RuleBase = {
  id: string
  required: boolean
  explain: Localized
}

export type Rule =
  | (RuleBase & { kind: 'age'; min?: number; max?: number })
  | (RuleBase & { kind: 'gender'; anyOf: Gender[] })
  | (RuleBase & { kind: 'state'; anyOf: StateCode[] })
  | (RuleBase & { kind: 'occupation'; anyOf: OccupationId[] })
  | (RuleBase & { kind: 'education'; min?: EducationLevel; student?: boolean })
  | (RuleBase & { kind: 'income'; maxAnnual?: number })
  | (RuleBase & { kind: 'social-category'; anyOf: SocialCategory[] })
  | (RuleBase & {
      kind: 'attribute'
      key: AttributeKey
      op: 'equals' | 'gte' | 'lte' | 'is-true' | 'is-false'
      value?: AttributeValue
    })
  | (RuleBase & { kind: 'manual-verify'; officialUrl: string })

export type RuleOutcome = 'pass' | 'fail' | 'unknown'

export type RuleResult = {
  rule: Rule
  outcome: RuleOutcome
}

export type EligibilityStatus =
  | 'likely'
  | 'potential'
  | 'insufficient'
  | 'not-matching'

export type RadarGroup = 'strong' | 'possible' | 'needs-info' | 'not-matching'

export type SchemeAssessment = {
  schemeId: string
  status: EligibilityStatus
  radar: RadarGroup
  matched: RuleResult[]
  failed: RuleResult[]
  unknown: RuleResult[]
  missingAnswerKeys: string[]
  notes: Localized[]
}

export type DocRequirement = 'required' | 'often-needed' | 'optional' | 'unclear'

export type SchemeDocument = {
  docId: string
  requirement: DocRequirement
  note?: Localized
}

export type Scheme = {
  id: string
  name: Localized
  fullName: Localized
  department: Localized
  level: 'central' | 'state'
  state?: StateCode
  categories: CategoryId[]
  beneficiaries: Localized
  summary: Localized
  eligibilityText: Localized
  benefits: Localized
  benefitsVerified: boolean
  application: Localized
  officialUrl: string
  otherUrls?: { label: string; url: string }[]
  documents: SchemeDocument[]
  rules: Rule[]
  lastVerified: string
  verification: VerificationStatus
  verificationNote?: Localized
  knownUncertainty?: Localized
  deadline?: Localized
  publication: PublicationStatus
  archivedNote?: Localized
  demoOnly?: boolean
}

export type AnswerValue = string | number | boolean

export type Answers = {
  state?: StateCode
  district?: string
  age?: number
  gender?: Gender
  socialCategory?: SocialCategory
  education?: EducationLevel
  student?: boolean
  occupation?: OccupationId
  incomeBand?: IncomeBand
  attributes?: Partial<Record<AttributeKey, AnswerValue>>
}

export type DocCatalogEntry = {
  id: string
  name: Localized
  purpose: Localized
  officialInfoUrl?: string
  obtainVia?: Localized
}
