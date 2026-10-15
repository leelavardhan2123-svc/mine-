import type { Localized } from '../data/types.ts'
import type { Scheme } from '../data/types.ts'
import { ALL_SCHEMES, getScheme } from '../data/index.ts'
import { bumpMetric, readMetrics } from './metrics.ts'

export type AiAnswer = {
  text: string
  mode: 'grounded' | 'ai'
  sources: { label: string; url: string }[]
  schemeId?: string
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

export function matchSchemeByName(message: string): Scheme | undefined {
  const q = message.toLowerCase()
  if (q.length < 3) return undefined
  const stop = new Set([
    'what', 'who', 'how', 'the', 'for', 'about', 'scheme', 'schemes', 'tell', 'me',
    'please', 'can', 'you', 'is', 'are', 'does', 'my', 'any', 'వివరాలు', 'పథకం',
  ])
  const words = q
    .replace(/[^a-z0-9\u0900-\u097f\u0c00-\u0c7f\s-]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 2 && !stop.has(word))
  let best: { scheme: Scheme; score: number } | undefined
  for (const scheme of ALL_SCHEMES) {
    if (scheme.publication !== 'published') continue
    const haystacks = [
      scheme.id.replace(/-/g, ' '),
      scheme.name.en.toLowerCase(),
      scheme.fullName.en.toLowerCase(),
    ]
    for (const haystack of haystacks) {
      for (const word of words) {
        if (haystack.includes(word)) {
          const score = word.length + (haystack.startsWith(word) ? 4 : 0)
          if (!best || score > best.score) best = { scheme, score }
        }
      }
    }
    const name = scheme.name.en.toLowerCase()
    const fullName = scheme.fullName.en.toLowerCase()
    if (q.includes(name) || q.includes(fullName)) return scheme
  }
  return best && best.score >= 5 ? best.scheme : undefined
}

function pickLocal(value: Localized, lang: 'en' | 'te') {
  return lang === 'te' && value.te ? value.te : value.en
}

function groundedAnswer({ question, schemeId, lang }: GroundedInput): AiAnswer {
  const matched = schemeId ? getScheme(schemeId) : matchSchemeByName(question)
  const scheme: Scheme | undefined = matched
  const q = question.toLowerCase()
  const te = lang === 'te'
  const sources = scheme
    ? [
        { label: scheme.officialUrl.replace(/^https?:\/\//, '').split('/')[0], url: scheme.officialUrl },
        ...(scheme.otherUrls ?? []),
      ]
    : []

  if (!scheme) {
    if (/hello|hi\b|hey|namaste|నమస్తే|హలో/.test(q)) {
      return {
        text: te
          ? 'నమస్తే! నేను సహాయక్ AI సహాయకుడిని. పథకాల గురించి ప్రశ్నించండి — "PM-KISAN అంటే ఏమిటి?", "నాకు ఏ పథకాలు వర్తిస్తాయి?" వంటివి అడగండి.'
          : 'Hello! I am the Sahayak AI assistant. Ask me about any scheme — for example "What is PM-KISAN?" or "Which schemes fit me?" — and I will answer from the verified scheme records in this catalogue.',
        mode: 'grounded',
        sources: [],
      }
    }
    return {
      text: te
        ? 'ఆ ప్రశ్నకు నేను ఖచ్చితమైన సమాధానం కనుగొనలేదు. పథకం పేరు చెప్పి అడగండి (ఉదా: "జల్ జీవన్ మిషన్ అంటే ఏమిటి?"), లేదా కింది చిప్‌లను ఉపయోగించండి. సమాధానాలు ఈ కేటలాగ్‌లోని అధికారిక రికార్డుల నుండే వస్తాయి; తుది అర్హత సంబంధిత శాఖే నిర్ధారిస్తుంది.'
        : 'I could not match that to a scheme in this catalogue. Try naming a scheme — for example "How does Jal Jeevan Mission work?" — or use the quick chips below. Answers come from the official records recorded here; final eligibility is always confirmed by the concerned department.',
      mode: 'grounded',
      sources: [],
    }
  }

  const name = lang === 'te' && scheme.name.te ? scheme.name.te : scheme.name.en
  const local = (value: Localized) => pickLocal(value, lang)

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
      ? `${name}: ${local(scheme.beneficiaries)}\n\n${local(scheme.eligibilityText)}`
      : `${name} is meant for: ${scheme.beneficiaries.en}\n\nEligibility as recorded: ${scheme.eligibilityText.en}`
  } else if (/apply|application|how|దరఖాస్తు|ఎలా/.test(q)) {
    body = te
      ? `${name} దరఖాస్తు విధానం:\n${local(scheme.application)}`
      : `How to apply for ${name}:\n${scheme.application.en}`
  } else if (/verify|before|check|తనిఖీ|ముందు/.test(q)) {
    body = te
      ? `దరఖాస్తు చేసే ముందు: మూలం ధ్రువీకరణ స్థితి — ${scheme.verification}, చివరిసారి తనిఖీ ${scheme.lastVerified}.${scheme.knownUncertainty ? `\n\nతెలిసిన అనిశ్చితి: ${local(scheme.knownUncertainty)}` : ''}\n\nఅర్హతను సంబంధిత శాఖ మాత్రమే తుదిగా నిర్ధారిస్తుంది.`
      : `Before applying: check the source verification status (${scheme.verification}) and last-verified date (${scheme.lastVerified}).${scheme.knownUncertainty ? `\n\nKnown uncertainty: ${scheme.knownUncertainty.en}` : ''}\n\nFinal eligibility is always determined by the concerned department.`
  } else {
    body = te
      ? `${name} — ${local(scheme.summary)}\n\nప్రయోజనం: ${local(scheme.benefits)}\n\nదరఖాస్తు: ${local(scheme.application)}`
      : `${name} — ${scheme.summary.en}\n\nBenefits: ${scheme.benefits.en}\n\nApplying: ${scheme.application.en}`
  }

  return { text: body, mode: 'grounded', sources, schemeId: scheme.id }
}

function aiEndpoint(): string | null {
  const configured = import.meta.env.VITE_AI_ENDPOINT as string | undefined
  if (configured) return configured
  if (typeof window !== 'undefined' && window.location.hostname.endsWith('vercel.app')) {
    return '/api/explain'
  }
  return null
}

async function aiAnswer(input: GroundedInput): Promise<AiAnswer | null> {
  const endpoint = aiEndpoint()
  if (!endpoint) return null
  const controller = new AbortController()
  const timer = window.setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(endpoint, {
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
