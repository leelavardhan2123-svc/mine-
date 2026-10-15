import type {
  Answers,
  IncomeBand,
  RadarGroup,
  Rule,
  RuleOutcome,
  RuleResult,
  Scheme,
  SchemeAssessment,
  EducationLevel,
} from '../data/types.ts'

const INCOME_BAND_RANGE: Record<IncomeBand, { min: number; max: number }> = {
  'under-1l': { min: 0, max: 100_000 },
  '1l-2.5l': { min: 100_000, max: 250_000 },
  '2.5l-5l': { min: 250_000, max: 500_000 },
  '5l-8l': { min: 500_000, max: 800_000 },
  '8l-10l': { min: 800_000, max: 1_000_000 },
  'above-10l': { min: 1_000_000, max: Number.POSITIVE_INFINITY },
}

const EDUCATION_RANK: Record<EducationLevel, number> = {
  'no-formal-schooling': 0,
  primary: 1,
  middle: 2,
  secondary: 3,
  'higher-secondary': 4,
  'iti-diploma': 5,
  graduate: 6,
  'post-graduate': 7,
}

export function incomeBandRange(band: IncomeBand): { min: number; max: number } {
  return INCOME_BAND_RANGE[band]
}

export function evaluateRule(rule: Rule, answers: Answers): RuleOutcome {
  switch (rule.kind) {
    case 'age': {
      if (typeof answers.age !== 'number' || Number.isNaN(answers.age)) return 'unknown'
      if (rule.min !== undefined && answers.age < rule.min) return 'fail'
      if (rule.max !== undefined && answers.age > rule.max) return 'fail'
      return 'pass'
    }
    case 'gender': {
      if (!answers.gender) return 'unknown'
      return rule.anyOf.includes(answers.gender) ? 'pass' : 'fail'
    }
    case 'state': {
      if (!answers.state) return 'unknown'
      return rule.anyOf.includes(answers.state) ? 'pass' : 'fail'
    }
    case 'occupation': {
      if (!answers.occupation) return 'unknown'
      return rule.anyOf.includes(answers.occupation) ? 'pass' : 'fail'
    }
    case 'education': {
      if (!answers.education) return 'unknown'
      let outcome: RuleOutcome = 'pass'
      if (rule.min !== undefined) {
        if (EDUCATION_RANK[answers.education] < EDUCATION_RANK[rule.min]) outcome = 'fail'
      }
      if (outcome === 'pass' && rule.student !== undefined) {
        if (answers.student === undefined) return 'unknown'
        if (answers.student !== rule.student) outcome = 'fail'
      }
      return outcome
    }
    case 'income': {
      if (!answers.incomeBand) return 'unknown'
      const band = INCOME_BAND_RANGE[answers.incomeBand]
      if (rule.maxAnnual === undefined) return 'unknown'
      if (band.max <= rule.maxAnnual) return 'pass'
      if (band.min > rule.maxAnnual) return 'fail'
      return 'unknown'
    }
    case 'social-category': {
      if (!answers.socialCategory) return 'unknown'
      return rule.anyOf.includes(answers.socialCategory) ? 'pass' : 'fail'
    }
    case 'attribute': {
      const raw = answers.attributes?.[rule.key]
      if (raw === undefined || raw === null || raw === '') return 'unknown'
      switch (rule.op) {
        case 'equals':
          return String(raw) === String(rule.value) ? 'pass' : 'fail'
        case 'gte': {
          const num = Number(raw)
          if (Number.isNaN(num)) return 'unknown'
          return num >= Number(rule.value) ? 'pass' : 'fail'
        }
        case 'lte': {
          const num = Number(raw)
          if (Number.isNaN(num)) return 'unknown'
          return num <= Number(rule.value) ? 'pass' : 'fail'
        }
        case 'is-true':
          return raw === true || raw === 'true' ? 'pass' : 'fail'
        case 'is-false':
          return raw === false || raw === 'false' ? 'pass' : 'fail'
        default:
          return 'unknown'
      }
    }
    case 'manual-verify':
      return 'unknown'
    default:
      return 'unknown'
  }
}

const ATTRIBUTE_QUESTION_KEY: Record<string, string> = {
  'landholding-acres': 'attributes.landholding-acres',
  'bank-account': 'attributes.bank-account',
  'disability-percent': 'attributes.disability-percent',
  'disability-certificate': 'attributes.disability-certificate',
  'has-pucca-house': 'attributes.has-pucca-house',
  'shg-member': 'attributes.shg-member',
  'street-vendor': 'attributes.street-vendor',
  pregnant: 'attributes.pregnant',
  'girl-child-under-10': 'attributes.girl-child-under-10',
  'unorganised-worker': 'attributes.unorganised-worker',
  'govt-employee': 'attributes.govt-employee',
  'income-tax-payer': 'attributes.income-tax-payer',
  'business-year-old': 'attributes.business-year-old',
  'enterprise-investment-lakhs': 'attributes.enterprise-investment-lakhs',
  'first-generation-entrepreneur': 'attributes.first-generation-entrepreneur',
  'minority-community': 'attributes.minority-community',
  'homeless-vending': 'attributes.homeless-vending',
  'secc-listed': 'attributes.secc-listed',
  'kisan-credit-existing': 'attributes.kisan-credit-existing',
}

export function questionKeyForRule(rule: Rule): string | undefined {
  switch (rule.kind) {
    case 'age':
      return 'age'
    case 'gender':
      return 'gender'
    case 'state':
      return 'state'
    case 'occupation':
      return 'occupation'
    case 'education':
      return 'education'
    case 'income':
      return 'incomeBand'
    case 'social-category':
      return 'socialCategory'
    case 'attribute':
      return ATTRIBUTE_QUESTION_KEY[rule.key]
    case 'manual-verify':
      return undefined
    default:
      return undefined
  }
}

export function radarGroupFor(status: SchemeAssessment['status']): RadarGroup {
  switch (status) {
    case 'likely':
      return 'strong'
    case 'potential':
      return 'possible'
    case 'insufficient':
      return 'needs-info'
    default:
      return 'not-matching'
  }
}

export function assessScheme(scheme: Scheme, answers: Answers): SchemeAssessment {
  const results: RuleResult[] = scheme.rules.map((rule) => ({
    rule,
    outcome: evaluateRule(rule, answers),
  }))

  const matched = results.filter((r) => r.outcome === 'pass')
  const failed = results.filter((r) => r.outcome === 'fail')
  const unknown = results.filter((r) => r.outcome === 'unknown')

  const requiredFail = failed.some((r) => r.rule.required)
  const requiredUnknown = unknown.some((r) => r.rule.required)

  let status: SchemeAssessment['status']
  if (requiredFail) status = 'not-matching'
  else if (matched.length === 0) status = 'insufficient'
  else if (requiredUnknown) status = 'potential'
  else status = 'likely'

  const missingAnswerKeys = Array.from(
    new Set(
      unknown
        .map((r) => questionKeyForRule(r.rule))
        .filter((key): key is string => typeof key === 'string'),
    ),
  )

  const notes: SchemeAssessment['notes'] = []
  if (scheme.level === 'state') {
    notes.push({
      en: `This scheme applies only in ${scheme.state === 'AP' ? 'Andhra Pradesh' : scheme.state === 'TG' ? 'Telangana' : 'its state'}.`,
    })
  }
  if (unknown.some((r) => r.rule.kind === 'manual-verify')) {
    notes.push({
      en: 'Some conditions can only be confirmed from official beneficiary or land-record databases — please verify at the official source before applying.',
    })
  }
  if (scheme.verification !== 'verified') {
    notes.push({
      en: `Record verification status: ${scheme.verification.replace('-', ' ')}. Details may have changed — confirm on the official portal.`,
    })
  }

  return {
    schemeId: scheme.id,
    status,
    radar: radarGroupFor(status),
    matched,
    failed,
    unknown,
    missingAnswerKeys,
    notes,
  }
}

export function assessAll(schemes: Scheme[], answers: Answers): SchemeAssessment[] {
  return schemes.map((scheme) => assessScheme(scheme, answers))
}

export const STATUS_ORDER: Record<RadarGroup, number> = {
  strong: 0,
  possible: 1,
  'needs-info': 2,
  'not-matching': 3,
}

export function sortAssessments<T extends SchemeAssessment>(assessments: T[]): T[] {
  return [...assessments].sort((a, b) => {
    const byStatus = STATUS_ORDER[a.radar] - STATUS_ORDER[b.radar]
    if (byStatus !== 0) return byStatus
    return b.matched.length - a.matched.length
  })
}
