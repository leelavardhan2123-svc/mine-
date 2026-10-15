import { readJSON, writeJSON } from './storage.ts'

export type Metrics = {
  assessments: number
  receiptsViewed: number
  passportSaves: number
  docsReady: number
  aiQuestions: number
  assistantOpens: number
}

const EMPTY: Metrics = {
  assessments: 0,
  receiptsViewed: 0,
  passportSaves: 0,
  docsReady: 0,
  aiQuestions: 0,
  assistantOpens: 0,
}

export function readMetrics(): Metrics {
  return { ...EMPTY, ...readJSON<Partial<Metrics>>('metrics', {}) }
}

export function bumpMetric(key: keyof Metrics, by = 1): Metrics {
  const next = readMetrics()
  next[key] = Math.max(0, next[key] + by)
  writeJSON('metrics', next)
  window.dispatchEvent(new CustomEvent('sahayak:metrics'))
  return next
}
