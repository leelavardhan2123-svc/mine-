export const PASSPORT_STATUSES = [
  'saved-for-later',
  'checking-eligibility',
  'preparing-documents',
  'ready-to-apply',
  'application-submitted',
  'awaiting-response',
  'completed',
  'needs-follow-up',
] as const

export type PassportStatus = (typeof PASSPORT_STATUSES)[number]

export type PassportEntry = {
  schemeId: string
  reason: string
  status: PassportStatus
  readyDocs: string[]
  savedAt: string
  lastChecked: string
}
