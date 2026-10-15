import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { ACTIVE_SCHEMES, getScheme } from '../src/data/index.ts'
import type { Answers, Scheme } from '../src/data/types.ts'
import {
  assessAll,
  assessScheme,
  evaluateRule,
  radarGroupFor,
  sortAssessments,
} from '../src/engine/eligibility.ts'

const farmerAnswers: Answers = {
  state: 'TG',
  age: 48,
  gender: 'male',
  socialCategory: 'general',
  education: 'secondary',
  student: false,
  occupation: 'farmer-owner',
  incomeBand: '1l-2.5l',
  attributes: {
    'landholding-acres': 3,
    'bank-account': true,
    'govt-employee': false,
    'income-tax-payer': false,
  },
}

describe('evaluateRule', () => {
  it('checks age boundaries inclusively', () => {
    const rule = { id: 'a', kind: 'age' as const, min: 18, max: 60, required: true, explain: { en: '' } }
    assert.equal(evaluateRule(rule, { age: 18 }), 'pass')
    assert.equal(evaluateRule(rule, { age: 60 }), 'pass')
    assert.equal(evaluateRule(rule, { age: 17 }), 'fail')
    assert.equal(evaluateRule(rule, { age: 61 }), 'fail')
    assert.equal(evaluateRule(rule, {}), 'unknown')
  })

  it('fails income when the whole band is above the limit and passes when below', () => {
    const rule = { id: 'i', kind: 'income' as const, maxAnnual: 250_000, required: true, explain: { en: '' } }
    assert.equal(evaluateRule(rule, { incomeBand: 'under-1l' }), 'pass')
    assert.equal(evaluateRule(rule, { incomeBand: '1l-2.5l' }), 'pass')
    assert.equal(evaluateRule(rule, { incomeBand: '5l-8l' }), 'fail')
    assert.equal(evaluateRule(rule, { incomeBand: '2.5l-5l' }), 'unknown')
    assert.equal(evaluateRule(rule, {}), 'unknown')
  })

  it('restricts state schemes geographically', () => {
    const rule = { id: 's', kind: 'state' as const, anyOf: ['AP'] as const, required: true, explain: { en: '' } }
    assert.equal(evaluateRule(rule, { state: 'AP' }), 'pass')
    assert.equal(evaluateRule(rule, { state: 'TG' }), 'fail')
    assert.equal(evaluateRule(rule, {}), 'unknown')
  })

  it('handles attribute operators', () => {
    const base = { id: 'x', kind: 'attribute' as const, required: true, explain: { en: '' } }
    assert.equal(evaluateRule({ ...base, key: 'landholding-acres', op: 'gte', value: 1 }, { attributes: { 'landholding-acres': 0.5 } }), 'fail')
    assert.equal(evaluateRule({ ...base, key: 'landholding-acres', op: 'gte', value: 1 }, { attributes: { 'landholding-acres': 2 } }), 'pass')
    assert.equal(evaluateRule({ ...base, key: 'govt-employee', op: 'is-false' }, { attributes: { 'govt-employee': false } }), 'pass')
    assert.equal(evaluateRule({ ...base, key: 'govt-employee', op: 'is-false' }, { attributes: { 'govt-employee': true } }), 'fail')
    assert.equal(evaluateRule({ ...base, key: 'govt-employee', op: 'is-false' }, {}), 'unknown')
  })

  it('treats manual verification as unknown', () => {
    const rule = { id: 'm', kind: 'manual-verify' as const, officialUrl: 'https://example.gov.in', required: false, explain: { en: '' } }
    assert.equal(evaluateRule(rule, farmerAnswers), 'unknown')
  })

  it('requires a higher education level', () => {
    const rule = { id: 'e', kind: 'education' as const, min: 'graduate' as const, required: true, explain: { en: '' } }
    assert.equal(evaluateRule(rule, { education: 'graduate' }), 'pass')
    assert.equal(evaluateRule(rule, { education: 'secondary' }), 'fail')
    assert.equal(evaluateRule(rule, {}), 'unknown')
  })
})

describe('assessScheme', () => {
  it('returns not-matching when a required rule fails', () => {
    const scheme = getScheme('ap-thalliki-vandanam')!
    const assessment = assessScheme(scheme, { ...farmerAnswers, state: 'TG' })
    assert.equal(assessment.status, 'not-matching')
    assert.equal(assessment.radar, 'not-matching')
  })

  it('returns unknown-required outcomes as potential when something matched', () => {
    const scheme = getScheme('pm-kisan')!
    const assessment = assessScheme(scheme, farmerAnswers)
    assert.ok(['likely', 'potential'].includes(assessment.status))
    assert.ok(assessment.matched.length > 0)
  })

  it('returns insufficient when nothing matched', () => {
    const scheme = getScheme('pm-kisan')!
    const assessment = assessScheme(scheme, {})
    assert.equal(assessment.status, 'insufficient')
    assert.equal(assessment.radar, 'needs-info')
    assert.ok(assessment.missingAnswerKeys.length > 0)
  })

  it('flags a government employee against PM-KISAN exclusions', () => {
    const scheme = getScheme('pm-kisan')!
    const assessment = assessScheme(scheme, {
      ...farmerAnswers,
      attributes: { ...farmerAnswers.attributes, 'govt-employee': true },
    })
    assert.equal(assessment.status, 'not-matching')
  })
})

describe('catalogue integrity', () => {
  it('has unique scheme ids', () => {
    const ids = ACTIVE_SCHEMES.map((scheme) => scheme.id)
    assert.equal(new Set(ids).size, ids.length)
  })

  it('gives every scheme an official url, verification date and at least one rule', () => {
    for (const scheme of ACTIVE_SCHEMES) {
      assert.match(scheme.officialUrl, /^https?:\/\//, scheme.id)
      assert.match(scheme.lastVerified, /^\d{4}-\d{2}-\d{2}$/, scheme.id)
      assert.ok(scheme.rules.length > 0, scheme.id)
      assert.ok(scheme.documents.length > 0, scheme.id)
    }
  })

  it('gives every state scheme a required state rule', () => {
    for (const scheme of ACTIVE_SCHEMES) {
      if (scheme.level !== 'state') continue
      const rule = scheme.rules.find((entry) => entry.kind === 'state')
      assert.ok(rule && rule.required, scheme.id)
      assert.ok(scheme.state, scheme.id)
    }
  })

  it('never reports archived schemes as published', () => {
    for (const scheme of ACTIVE_SCHEMES) {
      if (scheme.verification === 'archived') {
        assert.notEqual(scheme.publication, 'published')
      }
    }
  })
})

describe('assessAll + sorting', () => {
  it('covers the whole catalogue and sorts strong matches first', () => {
    const assessments = sortAssessments(assessAll(ACTIVE_SCHEMES, farmerAnswers))
    assert.equal(assessments.length, ACTIVE_SCHEMES.length)
    const order = assessments.map((assessment) => radarGroupFor(assessment.status))
    const firstPossible = order.indexOf('possible')
    const lastStrong = order.lastIndexOf('strong')
    if (firstPossible !== -1 && lastStrong !== -1) assert.ok(lastStrong < firstPossible)
  })

  it('keeps AP state schemes out of a Telangana profile', () => {
    const assessments = assessAll(ACTIVE_SCHEMES.filter((scheme: Scheme) => scheme.level === 'state'), farmerAnswers)
    for (const assessment of assessments) {
      const scheme = getScheme(assessment.schemeId)!
      if (scheme.state === 'AP') assert.equal(assessment.status, 'not-matching')
    }
  })
})
