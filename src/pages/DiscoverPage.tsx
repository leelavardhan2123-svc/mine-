import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { QuestionField } from '../components/QuestionField.tsx'
import { Callout, Card, ProgressBar } from '../components/ui/index.tsx'
import { QUESTIONS, STEPS, TOTAL_STEPS, getAnswerValue, questionsForStep, setAnswerValue } from '../data/questions.ts'
import type { Answers } from '../data/types.ts'
import { useNavigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { actions, useAppState } from '../services/store.ts'

export default function DiscoverPage() {
  const { t, pick } = useI18n()
  const navigate = useNavigate()
  const stored = useAppState().answers
  const [step, setStep] = useState(1)
  const [answers, setLocalAnswers] = useState<Answers>(stored ?? {})
  const [touched, setTouched] = useState(false)

  const visible = useMemo(() => questionsForStep(step, answers), [step, answers])
  const answeredCount = useMemo(
    () =>
      QUESTIONS.filter((question) => {
        const value = getAnswerValue(answers, question.id)
        return value !== undefined && value !== ''
      }).length,
    [answers],
  )

  const errors = useMemo(() => {
    const map: Record<string, string> = {}
    for (const question of visible) {
      const value = getAnswerValue(answers, question.id)
      if (question.kind === 'number' && typeof value === 'number') {
        if (question.min !== undefined && value < question.min) {
          map[question.id] = t('discover.validation', { min: question.min, max: question.max ?? '∞' })
        }
        if (question.max !== undefined && value > question.max) {
          map[question.id] = t('discover.validation', { min: question.min ?? 0, max: question.max })
        }
      }
    }
    return map
  }, [visible, answers, t])

  const hasErrors = Object.keys(errors).length > 0

  const update = (id: string, value: unknown) => {
    setTouched(true)
    setLocalAnswers((current) => setAnswerValue(current, id, value))
  }

  const persistAndGoResults = () => {
    actions.setAnswers(answers)
    actions.recordAssessment()
    navigate('/results')
  }

  const goNext = () => {
    if (hasErrors) return
    if (step < TOTAL_STEPS) setStep(step + 1)
    else persistAndGoResults()
  }

  const goBack = () => {
    if (step > 1) setStep(step - 1)
    else navigate('/')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold sm:text-3xl">{t('discover.title')}</h1>
          <p className="mt-1 text-sm text-muted">{t('discover.subtitle')}</p>
        </div>
        {touched && (
          <button
            type="button"
            className="btn btn-quiet btn-sm"
            onClick={() => {
              setLocalAnswers({})
              setStep(1)
            }}
          >
            <RotateCcw size={14} aria-hidden />
            {t('discover.resumeClear')}
          </button>
        )}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-muted">
          <span>
            {t('discover.progress', { step, total: TOTAL_STEPS })} — {STEPS[step - 1] && pick(STEPS[step - 1].title)}
          </span>
          <span>
            {answeredCount}/{QUESTIONS.length}
          </span>
        </div>
        <ProgressBar value={step} max={TOTAL_STEPS} />
      </div>

      <Card className="mt-6">
        <p className="text-sm text-muted">{STEPS[step - 1] && pick(STEPS[step - 1].subtitle)}</p>
        <div className="mt-5 space-y-7">
          {visible.map((question) => (
            <QuestionField
              key={question.id}
              question={question}
              value={getAnswerValue(answers, question.id) as string | number | boolean | undefined}
              onChange={(value) => update(question.id, value)}
              error={errors[question.id]}
            />
          ))}
        </div>
      </Card>

      <div className="mt-5">
        <Callout tone="info">{t('discover.localNote')}</Callout>
      </div>

      <div className="no-print mt-6 flex items-center justify-between gap-3">
        <button type="button" className="btn btn-outline" onClick={goBack}>
          <ArrowLeft size={16} aria-hidden />
          {t('discover.back')}
        </button>
        <div className="flex items-center gap-2">
          {step < TOTAL_STEPS && (
            <button type="button" className="btn btn-quiet" onClick={goNext} disabled={hasErrors}>
              {t('discover.skip')}
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={goNext} disabled={hasErrors}>
            {step === TOTAL_STEPS ? t('discover.seeResults') : t('discover.next')}
            <ArrowRight size={16} aria-hidden />
          </button>
        </div>
      </div>
    </div>
  )
}
