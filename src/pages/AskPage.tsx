import { useEffect, useRef, useState } from 'react'
import { ArrowUp, ExternalLink, MessageCircleQuestion, Sparkles, User } from 'lucide-react'
import { Callout, Card, OfficialLink, SpeakButton } from '../components/ui/index.tsx'
import { getScheme } from '../data/index.ts'
import { useHashRoute } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { answerQuestion, suggestedQuestions } from '../services/ai.ts'
import type { AiAnswer } from '../services/ai.ts'

type Turn = {
  id: number
  role: 'user' | 'assistant'
  text: string
  answer?: AiAnswer
}

let nextTurn = 1

export default function AskPage({ schemeId }: { schemeId?: string }) {
  const { t, pick, lang } = useI18n()
  const { segments } = useHashRoute()
  const id = schemeId ?? (segments[0] === 'ask' ? segments[1] : undefined)
  const scheme = id ? getScheme(id) : undefined
  const [question, setQuestion] = useState('')
  const [turns, setTurns] = useState<Turn[]>([])
  const [busy, setBusy] = useState(false)
  const endRef = useRef<HTMLDivElement>(null)
  const suggestions = suggestedQuestions(lang)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [turns, busy])

  const ask = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || busy) return
    setQuestion('')
    setTurns((prev) => [...prev, { id: nextTurn++, role: 'user', text: trimmed }])
    setBusy(true)
    try {
      const answer = await answerQuestion({ question: trimmed, schemeId: scheme?.id, lang })
      setTurns((prev) => [...prev, { id: nextTurn++, role: 'assistant', text: answer.text, answer }])
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-navy via-navy to-[#1b3a6b] px-6 py-8 text-white sm:px-9 sm:py-10">
        <div className="pointer-events-none absolute -right-16 -top-16 size-52 rounded-full bg-white/5" aria-hidden />
        <div className="pointer-events-none absolute -bottom-20 right-24 size-40 rounded-full bg-saffron/10" aria-hidden />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-saffron/20 ring-1 ring-white/20">
              <Sparkles size={19} className="text-saffron" aria-hidden />
            </span>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-saffron">
                {t('assistant.name')}
              </p>
              <h1 className="font-display text-2xl font-bold sm:text-3xl">{t('ai.title')}</h1>
            </div>
          </div>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/80 sm:text-base">{t('ai.heroSub')}</p>
          {scheme && (
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20">
              <MessageCircleQuestion size={13} aria-hidden />
              {pick(scheme.name)}
            </span>
          )}
        </div>
      </section>

      <Card className="mt-5 min-h-64">
        {turns.length === 0 ? (
          <div className="flex flex-col items-center px-2 py-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-ivory-deep text-navy ring-1 ring-line">
              <MessageCircleQuestion size={24} aria-hidden />
            </span>
            <p className="mt-4 font-display text-lg font-semibold text-navy">{t('ai.suggested')}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => void ask(suggestion)}
                  disabled={busy}
                  className="rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold text-navy transition hover:border-navy hover:bg-navy hover:text-white disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {turns.map((turn) =>
              turn.role === 'user' ? (
                <div key={turn.id} className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-md bg-navy px-4 py-2.5 text-sm leading-relaxed text-white">
                    {turn.text}
                  </div>
                </div>
              ) : (
                <div key={turn.id} className="flex gap-3">
                  <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-navy to-info text-white ring-1 ring-line">
                    <Sparkles size={15} aria-hidden />
                  </span>
                  <div className="max-w-[88%] rounded-2xl rounded-tl-md bg-ivory px-4 py-3 ring-1 ring-line">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`pill ${turn.answer?.mode === 'ai' ? 'pill-saffron' : 'pill-emerald'}`}
                      >
                        {turn.answer?.mode === 'ai' ? t('ai.aiAssisted') : t('ai.grounded')}
                      </span>
                      <SpeakButton text={turn.text} />
                      {turn.answer?.schemeId && (
                        <a
                          href={`#/scheme/${turn.answer.schemeId}`}
                          className="inline-flex items-center gap-1 rounded-full bg-emerald-soft px-2.5 py-1 text-xs font-semibold text-emerald hover:underline"
                        >
                          <ExternalLink size={12} aria-hidden />
                          {t('assistant.openScheme')}
                        </a>
                      )}
                    </div>
                    <p className="mt-2.5 whitespace-pre-line text-sm leading-relaxed text-ink">{turn.text}</p>
                    {turn.answer && turn.answer.sources.length > 0 && (
                      <div className="mt-3 flex flex-col gap-1 border-t border-line pt-3">
                        {turn.answer.sources.map((source) => (
                          <OfficialLink key={source.url} url={source.url} label={source.label} />
                        ))}
                      </div>
                    )}
                    {turn.answer?.mode === 'grounded' && (
                      <p className="mt-2.5 text-xs text-muted">{t('ai.offlineAnswer')}</p>
                    )}
                  </div>
                </div>
              ),
            )}
            {busy && (
              <div className="flex gap-3">
                <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-linear-to-br from-navy to-info text-white ring-1 ring-line">
                  <Sparkles size={15} aria-hidden />
                </span>
                <div className="inline-flex items-center gap-1.5 rounded-2xl rounded-tl-md bg-ivory px-4 py-3 text-xs text-muted ring-1 ring-line">
                  <span className="size-1.5 animate-pulse rounded-full bg-muted" aria-hidden />
                  <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:150ms]" aria-hidden />
                  <span className="size-1.5 animate-pulse rounded-full bg-muted [animation-delay:300ms]" aria-hidden />
                  <span className="ml-1">{t('ai.thinking')}</span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        )}
      </Card>

      <div className="mt-4 rounded-2xl border border-line bg-white p-2 shadow-sm transition focus-within:ring-2 focus-within:ring-info/40">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void ask(question)
          }}
          className="flex items-center gap-2"
        >
          <span className="ml-2 hidden text-muted sm:block">
            <User size={16} aria-hidden />
          </span>
          <input
            className="min-w-0 flex-1 border-0 bg-transparent px-1 py-2 text-sm outline-none placeholder:text-muted"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t('ai.placeholder')}
            aria-label={t('ai.title')}
          />
          <button
            type="submit"
            aria-label={t('ai.send')}
            disabled={busy || !question.trim()}
            className="grid size-10 shrink-0 place-items-center rounded-xl bg-navy text-white transition hover:bg-info disabled:opacity-40"
          >
            {busy ? (
              <span className="size-4 animate-spin rounded-full border-2 border-white/40 border-t-white" aria-hidden />
            ) : (
              <ArrowUp size={17} aria-hidden />
            )}
          </button>
        </form>
        {turns.length > 0 && (
          <div className="flex flex-wrap gap-1.5 px-2 pb-1 pt-2">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => void ask(suggestion)}
                disabled={busy}
                className="rounded-full bg-ivory px-2.5 py-1 text-[11px] font-semibold text-navy ring-1 ring-line hover:bg-white disabled:opacity-50"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <Callout tone="info">{t('ai.disclaimer')}</Callout>
      </div>
    </div>
  )
}
