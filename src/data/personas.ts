import type { Answers } from './types.ts'
import type { FamilyMemberType } from '../services/profiles.ts'

export type Persona = {
  id: string
  memberType: FamilyMemberType
  labelKey: 'persona.student.label' | 'persona.farmer.label' | 'persona.senior.label' | 'persona.entrepreneur.label' | 'persona.youth.label'
  descKey: 'persona.student.desc' | 'persona.farmer.desc' | 'persona.senior.desc' | 'persona.entrepreneur.desc' | 'persona.youth.desc'
  answers: Answers
}

export const PERSONAS: Persona[] = [
  {
    id: 'student',
    memberType: 'student',
    labelKey: 'persona.student.label',
    descKey: 'persona.student.desc',
    answers: {
      state: 'AP',
      age: 19,
      gender: 'female',
      socialCategory: 'obc',
      education: 'higher-secondary',
      student: true,
      occupation: 'student',
      incomeBand: '1l-2.5l',
      attributes: {
        'bank-account': true,
        'govt-employee': false,
        'income-tax-payer': false,
        'girl-child-under-10': false,
        pregnant: false,
        'has-pucca-house': true,
      },
    },
  },
  {
    id: 'farmer',
    memberType: 'farmer',
    labelKey: 'persona.farmer.label',
    descKey: 'persona.farmer.desc',
    answers: {
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
        'kisan-credit-existing': true,
        'govt-employee': false,
        'income-tax-payer': false,
        'has-pucca-house': true,
        'unorganised-worker': false,
      },
    },
  },
  {
    id: 'senior',
    memberType: 'senior',
    labelKey: 'persona.senior.label',
    descKey: 'persona.senior.desc',
    answers: {
      state: 'AP',
      age: 68,
      gender: 'male',
      socialCategory: 'general',
      education: 'middle',
      student: false,
      occupation: 'retired-senior',
      incomeBand: 'under-1l',
      attributes: {
        'bank-account': true,
        'govt-employee': false,
        'income-tax-payer': false,
        'has-pucca-house': false,
        'unorganised-worker': false,
      },
    },
  },
  {
    id: 'entrepreneur',
    memberType: 'business',
    labelKey: 'persona.entrepreneur.label',
    descKey: 'persona.entrepreneur.desc',
    answers: {
      state: 'TG',
      age: 34,
      gender: 'female',
      socialCategory: 'obc',
      education: 'secondary',
      student: false,
      occupation: 'self-employed-business',
      incomeBand: '2.5l-5l',
      attributes: {
        'business-year-old': 3,
        'enterprise-investment-lakhs': 1.5,
        'first-generation-entrepreneur': true,
        'shg-member': true,
        'bank-account': true,
        'govt-employee': false,
        'income-tax-payer': false,
        'has-pucca-house': true,
        'minority-community': false,
      },
    },
  },
  {
    id: 'youth',
    memberType: 'worker',
    labelKey: 'persona.youth.label',
    descKey: 'persona.youth.desc',
    answers: {
      state: 'TG',
      age: 24,
      gender: 'male',
      socialCategory: 'sc',
      education: 'graduate',
      student: false,
      occupation: 'unemployed',
      incomeBand: 'under-1l',
      attributes: {
        'bank-account': true,
        'unorganised-worker': true,
        'govt-employee': false,
        'income-tax-payer': false,
        'has-pucca-house': true,
      },
    },
  },
]

export function getPersona(id: string): Persona | undefined {
  return PERSONAS.find((persona) => persona.id === id)
}
