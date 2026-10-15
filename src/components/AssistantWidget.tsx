import { useEffect, useRef, useState } from 'react'
import { ExternalLink, MessageCircle, Send, Sparkles, X } from 'lucide-react'
import { navigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { ALL_SCHEMES, getScheme } from '../data/index.ts'
import { assessAll, sortAssessments } from '../engine/eligibility.ts'
import type { SchemeAssessment } from '../data/types.ts'
import { answerQuestion, matchSchemeByName } from '../services/ai.ts'
import type { AiAnswer } from '../services/ai.ts'
import { useAppState } from '../services/store.ts'
import { bumpMetric } from '../services/metrics.ts'

type ChatMessage = {
  id: number
  role: 'user' | 'assistant'
  text: string
  sources?: { label: string; url: string }[]
  schemeId?: string
  action?: 'start-questionnaire' | 'open-directory' | 'open-about'
}

let nextId = 1

function makeUser(text: string): ChatMessage {
  return { id: nextId++, role: 'user', text }
}

export default function AssistantWidget() {
  const { t, lang, pick } = useI18n()
  const { answers: storedAnswers } = useAppState()
  const answers = storedAnswers ?? {}
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const listRef = useRef<HTMLDivElement>(null)
  const greetedRef = useRef(false)

  useEffect(() => {
    if (!open || greetedRef.current) return
    greetedRef.current = true
    setMessages([
      {
        id: nextId++,
        role: 'assistant',
        text: t('assistant.greeting'),
      },
    ])
  }, [open, t])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, thinking])

  const matchesMessage = (): ChatMessage => {
    const hasAnswers = Boolean(answers.state || answers.age || answers.occupation || answers.incomeBand)
    if (!hasAnswers) {
      return {
        id: nextId++,
        role: 'assistant',
        text: `${t('assistant.noAnswers')}\n\n${t('assistant.noAnswersHint')}`,
        action: 'start-questionnaire',
      }
    }
    const assessments = sortAssessments(assessAll(ALL_SCHEMES, answers))
      .filter((a: SchemeAssessment) => a.status === 'likely' || a.status === 'potential')
      .slice(0, 6)
    if (assessments.length === 0) {
      return {
        id: nextId++,
        role: 'assistant',
        text: t('assistant.noMatches'),
        action: 'open-directory',
      }
    }
    const lines = assessments.map((a: SchemeAssessment) => {
      const scheme = getScheme(a.schemeId)
      const label = scheme ? pick(scheme.name) : a.schemeId
      return `• ${label} — ${t(`status.${a.status}` as const)}`
    })
    return {
      id: nextId++,
      role: 'assistant',
      text: `${t('assistant.matchesIntro')}\n\n${lines.join('\n')}`,
    }
  }

  const send = async (raw: string) => {
    const text = raw.trim()
    if (!text || thinking) return
    setInput('')
    setMessages((prev) => [...prev, makeUser(text)])
    setThinking(true)
    try {
      const q = text.toLowerCase()
      if (/(scheme|పథక).*(for me|fit|నాకు|సరిపో)|which schemes|recommend|my schemes|నాకు ఏ పథక/.test(q)) {
        await new Promise((resolve) => setTimeout(resolve, 250))
        setMessages((prev) => [...prev, matchesMessage()])
        return
      }
      if (/(what is sahayak|about sahayak|సహాయక్ అంటే)/.test(q)) {
        await new Promise((resolve) => setTimeout(resolve, 200))
        setMessages((prev) => [
          ...prev,
          {
            id: nextId++,
            role: 'assistant',
            text: `${t('app.description')}\n\n${t('about.mission')}\n\n${t('footer.notOfficial')}`,
            action: 'open-about',
          },
        ])
        return
      }
      const byName = matchSchemeByName(text)
      const answer: AiAnswer = await answerQuestion({ question: text, schemeId: byName?.id, lang })
      setMessages((prev) => [
        ...prev,
        {
          id: nextId++,
          role: 'assistant',
          text: answer.text,
          sources: answer.sources,
          schemeId: answer.schemeId,
        },
      ])
    } finally {
      setThinking(false)
    }
  }

  const chips: { key: 'assistant.chipMatches' | 'assistant.chipAsk' | 'assistant.chipApply' | 'assistant.chipAbout'; send: string }[] = [
    { key: 'assistant.chipMatches', send: t('assistant.chipMatches') },
    { key: 'assistant.chipAsk', send: t('assistant.chipAsk') },
    { key: 'assistant.chipApply', send: t('assistant.chipApply') },
    { key: 'assistant.chipAbout', send: t('assistant.chipAbout') },
  ]

  return (
    <div className="no-print fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      {open && (
        <section
          aria-label={t('assistant.name')}
          className="flex h-[min(30rem,72vh)] w-[min(22rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
        >
          <header className="flex items-center gap-2 border-b border-line bg-navy px-3 py-2.5 text-white">
            <span className="grid size-8 place-items-center rounded-full bg-white/15">
              <Sparkles size={16} aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight">{t('assistant.name')}</p>
              <p className="text-[11px] leading-tight text-white/70">{t('app.tagline')}</p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t('assistant.close')}
              className="rounded-full p-1.5 hover:bg-white/15"
            >
              <X size={16} aria-hidden />
            </button>
          </header>

          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-ivory px-3 py-3">
            {messages.map((message) => (
              <div key={message.id}>
                <div
                  className={`max-w-[90%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-[13px] leading-relaxed ${
                    message.role === 'user'
                      ? 'ml-auto bg-navy text-white'
                      : 'bg-white text-ink ring-1 ring-line'
                  }`}
                >
                  {message.text}
                </div>
                {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-2 pl-1">
                    {message.sources.map((source) => (
                      <a
                        key={source.url}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold text-info ring-1 ring-line hover:underline"
                      >
                        <ExternalLink size={11} aria-hidden />
                        {source.label}
                      </a>
                    ))}
                  </div>
                )}
                {message.role === 'assistant' && message.schemeId && (
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/scheme/${message.schemeId}`)
                      bumpMetric('assistantOpens')
                    }}
                    className="mt-1.5 ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2.5 py-1 text-[11px] font-semibold text-emerald hover:underline"
                  >
                    {t('assistant.openScheme')}
                  </button>
                )}
                {message.role === 'assistant' && message.action === 'start-questionnaire' && (
                  <button
                    type="button"
                    onClick={() => navigate('/discover')}
                    className="mt-1.5 ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2.5 py-1 text-[11px] font-semibold text-emerald hover:underline"
                  >
                    {t('assistant.startQuestionnaire')}
                  </button>
                )}
                {message.role === 'assistant' && message.action === 'open-directory' && (
                  <button
                    type="button"
                    onClick={() => navigate('/directory')}
                    className="mt-1.5 ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2.5 py-1 text-[11px] font-semibold text-emerald hover:underline"
                  >
                    {t('nav.directory')}
                  </button>
                )}
                {message.role === 'assistant' && message.action === 'open-about' && (
                  <button
                    type="button"
                    onClick={() => navigate('/about')}
                    className="mt-1.5 ml-1 inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2.5 py-1 text-[11px] font-semibold text-emerald hover:underline"
                  >
                    {t('nav.about')}
                  </button>
                )}
              </div>
            ))}
            {thinking && (
              <div className="inline-flex items-center gap-1.5 rounded-2xl bg-white px-3 py-2 text-xs text-muted ring-1 ring-line">
                <span className="size-1.5 animate-pulse rounded-full bg-muted" />
                <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:150ms]" />
                <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:300ms]" />
                <span className="ml-1">{t('assistant.typing')}</span>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-white px-3 py-2">
            <div className="flex flex-wrap gap-1.5">
              {chips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => void send(chip.send)}
                  disabled={thinking}
                  className="rounded-full bg-ivory px-2.5 py-1 text-[11px] font-semibold text-navy ring-1 ring-line hover:bg-white disabled:opacity-50"
                >
                  {t(chip.key)}
                </button>
              ))}
            </div>
            <form
              className="mt-2 flex items-center gap-2"
              onSubmit={(event) => {
                event.preventDefault()
                void send(input)
              }}
            >
              <input
                className="input !mt-0 flex-1 !py-1.5 text-[13px]"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t('assistant.placeholder')}
                aria-label={t('assistant.placeholder')}
              />
              <button
                type="submit"
                disabled={thinking || !input.trim()}
                className="btn btn-primary !px-2.5 !py-1.5"
                aria-label={t('assistant.send')}
              >
                <Send size={14} aria-hidden />
              </button>
            </form>
            <p className="mt-1.5 text-[10px] leading-snug text-muted">{t('assistant.disclaimer')}</p>
          </div>
        </section>
      )}

      <button
        type="button"
        onClick={() => {
          bumpMetric('assistantOpens')
          setOpen((value) => !value)
        }}
        aria-label={open ? t('assistant.close') : t('assistant.open')}
        aria-expanded={open}
        className="grid size-14 place-items-center rounded-full bg-navy text-white shadow-xl transition hover:scale-105 hover:bg-info focus:outline-none focus-visible:ring-4 focus-visible:ring-info/40"
      >
        {open ? <X size={22} aria-hidden /> : <MessageCircle size={24} aria-hidden />}
      </button>
    </div>
  )
}
