import type { Localized } from '../data/types.ts'
import type { Scheme } from '../data/types.ts'
import { getScheme } from '../data/index.ts'
import { bumpMetric, readMetrics } from './metrics.ts'

export type AiAnswer = {
  text: string
  mode: 'grounded' | 'ai'
  sources: { label: string; url: string }[]
}

export const SUGGESTED_QUESTIONS: Localized[] = [
  { en: 'What is this scheme?', te: 'ఈ పథకం ఏమిటి?' },
  { en: 'Who is it for?', te: 'ఇది ఎవరి కోసం?' },
  { en: 'What documents should I prepare?', te: 'నేను ఏ పత్రాలు సిద్ధం చేయాలి?' },
  { en: 'How do I apply?', te: 'నేను ఎలా దరఖాస్తు చేయాలి?' },
  { en: 'What should I verify before applying?', te: 'దరఖాస్తు చేసే ముందు ఏమి తనిఖీ చేయాలి?' },
]

type GroundedInput = {
  question: string
  schemeId?: string
  lang: 'en' | 'te'
}

function groundedAnswer({ question, schemeId, lang }: GroundedInput): AiAnswer {
  const scheme: Scheme | undefined = schemeId ? getScheme(schemeId) : undefined
  const q = question.toLowerCase()
  const te = lang === 'te'
  const sources = scheme
    ? [
        { label: scheme.officialUrl.replace(/^https?:\/\//, '').split('/')[0], url: scheme.officialUrl },
        ...(scheme.otherUrls ?? []),
      ]
    : []

  if (!scheme) {
    return {
      text: te
        ? 'సహాయక్‌లో ప్రస్తుతం AI సేవ కాన్ఫిగర్ చేయబడలేదు. ఒక పథకాన్ని తెరిచి, దాని గురించి ప్రశ్నించండి — సమాధానం ఆ పథకం రికార్డుల నుండే వస్తుంది.'
        : 'No AI service is configured right now. Open a scheme and ask about it — answers are assembled from that scheme’s own verified record.',
      mode: 'grounded',
      sources: [],
    }
  }

  const name = lang === 'te' && scheme.name.te ? scheme.name.te : scheme.name.en
  const pickLocal = (value: Localized) => (lang === 'te' && value.te ? value.te : value.en)

  let body: string
  if (/document|papers|proof|పత్ర|ధ్రువీ/.test(q)) {
    const docs = scheme.documents
      .map((doc) => `• ${doc.docId.replace(/-/g, ' ')} (${doc.requirement})`)
      .join('\n')
    body = te
      ? `${name} కోసం పథకం రికార్డులో ఉన్న పత్రాలు:\n${docs}\n\nస్థానిక కార్యాలయం నియమాలను బట్టి కొన్ని పత్రాలు మారవచ్చు — అధికారిక పోర్టల్‌లో నిర్ధారించుకోండి.`
      : `Documents recorded for ${name}:\n${docs}\n\nSome documents can vary by local office practice — confirm on the official portal.`
  } else if (/who|intended|beneficiar|ఎవరు|కోసం/.test(q)) {
    body = te
      ? `${name}: ${pickLocal(scheme.beneficiaries)}\n\n${pickLocal(scheme.eligibilityText)}`
      : `${name} is meant for: ${scheme.beneficiaries.en}\n\nEligibility as recorded: ${scheme.eligibilityText.en}`
  } else if (/apply|application|how|దరఖాస్తు|ఎలా/.test(q)) {
    body = te
      ? `${name} దరఖాస్తు విధానం:\n${pickLocal(scheme.application)}`
      : `How to apply for ${name}:\n${scheme.application.en}`
  } else if (/verify|before|check|తనిఖీ|ముందు/.test(q)) {
    body = te
      ? `దరఖాస్తు చేసే ముందు: మూలం ధ్రువీకరణ స్థితి — ${scheme.verification}, చివరిసారి తనిఖీ ${scheme.lastVerified}.${scheme.knownUncertainty ? `\n\nతెలిసిన అనిశ్చితి: ${pickLocal(scheme.knownUncertainty)}` : ''}\n\nఅర్హతను సంబంధిత శాఖ మాత్రమే తుదిగా నిర్ధారిస్తుంది.`
      : `Before applying: check the source verification status (${scheme.verification}) and last-verified date (${scheme.lastVerified}).${scheme.knownUncertainty ? `\n\nKnown uncertainty: ${scheme.knownUncertainty.en}` : ''}\n\nFinal eligibility is always determined by the concerned department.`
  } else {
    body = te
      ? `${name} — ${pickLocal(scheme.summary)}\n\nప్రయోజనం: ${pickLocal(scheme.benefits)}\n\nదరఖాస్తు: ${pickLocal(scheme.application)}`
      : `${name} — ${scheme.summary.en}\n\nBenefits: ${scheme.benefits.en}\n\nApplying: ${scheme.application.en}`
  }

  return { text: body, mode: 'grounded', sources }
}

async function aiAnswer(input: GroundedInput): Promise<AiAnswer | null> {
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch('/api/explain', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
      signal: controller.signal,
    })
    if (!response.ok) return null
    const data = (await response.json()) as { text?: string; sources?: { label: string; url: string }[] }
    if (!data.text) return null
    return { text: data.text, mode: 'ai', sources: data.sources ?? [] }
  } catch {
    return null
  } finally {
    window.clearTimeout(timer)
  }
}

export async function answerQuestion(input: GroundedInput): Promise<AiAnswer> {
  bumpMetric('aiQuestions')
  const remote = await aiAnswer(input)
  if (remote) return remote
  return groundedAnswer(input)
}

export function readAiMetrics() {
  return readMetrics()
}
