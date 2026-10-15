import type { Answers } from '../data/types.ts'

export type FamilyMemberType =
  | 'student'
  | 'farmer'
  | 'senior'
  | 'woman'
  | 'worker'
  | 'business'
  | 'other'

export type FamilyProfile = {
  id: string
  label: string
  memberType: FamilyMemberType
  answers: Answers
  createdAt: string
}

export function newProfileId(): string {
  return `fp-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}
