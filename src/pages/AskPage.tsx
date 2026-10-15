import { useEffect, useMemo, useRef, useState } from 'react'
import { Send, Sparkles } from 'lucide-react'
import { Callout, Card, OfficialLink, SectionHeading, SpeakButton } from '../components/ui/index.tsx'
import { getScheme } from '../data/index.ts'
import { useHashRoute } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { answerQuestion, SUGGESTED_QUESTIONS } from '../services/ai.ts'
import type { AiAnswer } from '../services/ai.ts'

export default function AskPage({ schemeId }: { schemeId?: string }) {
  const { t, pick, lang } = useI18n()
  const { segments } = useHashRoute()
  const id = schemeId ?? (segments[0] === 'ask' ? segments[1] : undefined)
  const scheme = id ? getScheme(id) : undefined
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState<AiAnswer | null>(null)
  const [busy, setBusy] = useState(false)
  const answerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (answer) answerRef.current?.focus()
  }, [answer])

  const ask = async (text: string) => {
    if (!text.trim()) return
    setBusy(true)
    setQuestion(text)
    try {
      const result = await answerQuestion({
        question: text,
        schemeId: scheme?.id,
        lang,
      })
      setAnswer(result)
    } finally {
      setBusy(false)
    }
  }

  const suggestions = useMemo(() => SUGGESTED_QUESTIONS, [])

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <SectionHeading
        title={t('ai.title')}
        subtitle={scheme ? pick(scheme.name) : undefined}
      />

      <Card className="mt-6">
        <form
          onSubmit={(event) => {
            event.preventDefault()
            void ask(question)
          }}
          className="flex flex-wrap gap-2"
        >
          <input
            className="input flex-1"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder={t('ai.placeholder')}
            aria-label={t('ai.title')}
          />
          <button type="submit" className="btn btn-primary" disabled={busy || !question.trim()}>
            {busy ? t('ai.thinking') : t('ai.send')}
            <Send size={15} aria-hidden />
          </button>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.en}
              type="button"
              className="pill pill-muted"
              onClick={() => void ask(pick(suggestion))}
            >
              {pick(suggestion)}
            </button>
          ))}
        </div>
      </Card>

      {answer && (
        <div ref={answerRef} tabIndex={-1} className="mt-4 outline-none">
          <Card>
            <div className="flex flex-wrap items-center gap-2">
              <span className={`pill ${answer.mode === 'grounded' ? 'pill-emerald' : 'pill-saffron'}`}>
                <Sparkles size={12} aria-hidden />
                {answer.mode === 'grounded' ? t('ai.grounded') : t('ai.aiAssisted')}
              </span>
              <SpeakButton text={answer.text} />
            </div>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-ink">{answer.text}</p>
            {answer.sources.length > 0 && (
              <div className="mt-4 space-y-1 border-t border-line pt-3">
                {answer.sources.map((source) => (
                  <OfficialLink key={source.url} url={source.url} label={source.label} />
                ))}
              </div>
            )}
            {answer.mode === 'grounded' && (
              <p className="mt-3 text-xs text-muted">{t('ai.offlineAnswer')}</p>
            )}
          </Card>
        </div>
      )}

      <div className="mt-4">
        <Callout tone="info">{t('ai.disclaimer')}</Callout>
      </div>
    </div>
  )
}
