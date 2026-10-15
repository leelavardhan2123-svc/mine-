import { useSyncExternalStore } from 'react'
import type { Answers } from '../data/types.ts'
import { readMetrics, bumpMetric } from './metrics.ts'
import type { Metrics } from './metrics.ts'
import type { PassportEntry, PassportStatus } from './passport.ts'
import type { FamilyProfile } from './profiles.ts'
import { newProfileId } from './profiles.ts'
import { clearAllSahayakData, readJSON, writeJSON } from './storage.ts'

export type AppState = {
  passport: PassportEntry[]
  profiles: FamilyProfile[]
  answers: Answers | null
  readyDocs: Record<string, string[]>
  metrics: Metrics
}

let state: AppState = {
  passport: readJSON<PassportEntry[]>('passport', []),
  profiles: readJSON<FamilyProfile[]>('profiles', []),
  answers: readJSON<Answers | null>('answers', null),
  readyDocs: readJSON<Record<string, string[]>>('readyDocs', {}),
  metrics: readMetrics(),
}

const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((listener) => listener())
}

function setState(patch: Partial<AppState>) {
  state = { ...state, ...patch }
  emit()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getState() {
  return state
}

export function useAppState(): AppState {
  return useSyncExternalStore(subscribe, getState, getState)
}

export const actions = {
  saveToPassport(schemeId: string) {
    if (state.passport.some((entry) => entry.schemeId === schemeId)) return
    const entry: PassportEntry = {
      schemeId,
      reason: '',
      status: 'saved-for-later',
      readyDocs: [],
      savedAt: new Date().toISOString(),
      lastChecked: new Date().toISOString(),
    }
    const passport = [...state.passport, entry]
    writeJSON('passport', passport)
    bumpMetric('passportSaves')
    setState({ passport, metrics: readMetrics() })
  },
  removeFromPassport(schemeId: string) {
    const passport = state.passport.filter((entry) => entry.schemeId !== schemeId)
    writeJSON('passport', passport)
    setState({ passport })
  },
  updatePassportEntry(schemeId: string, patch: Partial<Omit<PassportEntry, 'schemeId'>>) {
    const passport = state.passport.map((entry) =>
      entry.schemeId === schemeId ? { ...entry, ...patch } : entry,
    )
    writeJSON('passport', passport)
    setState({ passport })
  },
  setPassportStatus(schemeId: string, status: PassportStatus) {
    actions.updatePassportEntry(schemeId, { status })
  },
  isSaved(schemeId: string) {
    return state.passport.some((entry) => entry.schemeId === schemeId)
  },
  setAnswers(answers: Answers | null) {
    writeJSON('answers', answers)
    setState({ answers })
  },
  recordAssessment() {
    bumpMetric('assessments')
    setState({ metrics: readMetrics() })
  },
  recordReceipt() {
    bumpMetric('receiptsViewed')
    setState({ metrics: readMetrics() })
  },
  toggleReadyDoc(schemeId: string, docId: string) {
    const current = state.readyDocs[schemeId] ?? []
    const next = current.includes(docId)
      ? current.filter((id) => id !== docId)
      : [...current, docId]
    const readyDocs = { ...state.readyDocs, [schemeId]: next }
    writeJSON('readyDocs', readyDocs)
    bumpMetric('docsReady', current.includes(docId) ? -1 : 1)
    setState({ readyDocs, metrics: readMetrics() })
  },
  addProfile(profile: Omit<FamilyProfile, 'id' | 'createdAt'>): FamilyProfile {
    const created: FamilyProfile = {
      ...profile,
      id: newProfileId(),
      createdAt: new Date().toISOString(),
    }
    const profiles = [...state.profiles, created]
    writeJSON('profiles', profiles)
    setState({ profiles })
    return created
  },
  updateProfile(id: string, patch: Partial<FamilyProfile>) {
    const profiles = state.profiles.map((profile) =>
      profile.id === id ? { ...profile, ...patch } : profile,
    )
    writeJSON('profiles', profiles)
    setState({ profiles })
  },
  removeProfile(id: string) {
    const profiles = state.profiles.filter((profile) => profile.id !== id)
    writeJSON('profiles', profiles)
    setState({ profiles })
  },
  clearAll() {
    clearAllSahayakData()
    setState({
      passport: [],
      profiles: [],
      answers: null,
      readyDocs: {},
      metrics: readMetrics(),
    })
  },
  refreshMetrics() {
    setState({ metrics: readMetrics() })
  },
}
