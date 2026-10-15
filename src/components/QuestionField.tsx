import { useEffect, useId, useState } from 'react'
import { HelpCircle } from 'lucide-react'
import type { Question } from '../data/questions.ts'
import { STATE_CODES } from '../data/types.ts'
import type { AnswerValue, StateCode } from '../data/types.ts'
import { en } from '../i18n/en.ts'
import { te } from '../i18n/te.ts'
import type { Lang } from '../i18n/context.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { SpeakButton } from './ui/index.tsx'

function stateName(code: string, lang: Lang): string {
  const key = `states.${code}`
  const teName = (te as Record<string, string | undefined>)[key]
  const enName = (en as Record<string, string>)[key]
  return (lang === 'te' && teName) || enName || code
}

function resolveState(text: string): StateCode | undefined {
  const q = text.trim().toLowerCase()
  if (!q) return undefined
  for (const code of STATE_CODES) {
    if (
      code.toLowerCase() === q ||
      stateName(code, 'en').toLowerCase() === q ||
      stateName(code, 'te').toLowerCase() === q
    ) {
      return code
    }
  }
  if (q.length >= 3) {
    for (const code of STATE_CODES) {
      const enName = stateName(code, 'en').toLowerCase()
      const teName = stateName(code, 'te').toLowerCase()
      if (enName.startsWith(q) || teName.startsWith(q) || code.toLowerCase().startsWith(q)) {
        return code
      }
    }
  }
  return undefined
}

export function QuestionField({
  question,
  value,
  onChange,
  error,
}: {
  question: Question
  value: AnswerValue | undefined
  onChange: (value: AnswerValue | undefined) => void
  error?: string
}) {
  const { t, pick, lang } = useI18n()
  const groupId = useId()
  const label = pick(question.label)
  const help = question.help ? pick(question.help) : undefined
  const why = question.why ? pick(question.why) : undefined

  const [stateText, setStateText] = useState(() =>
    question.kind === 'state' && typeof value === 'string' ? stateName(value, lang) : '',
  )

  useEffect(() => {
    if (question.kind !== 'state') return
    if (typeof value === 'string') {
      const display = stateName(value, lang)
      if (resolveState(stateText) !== value) setStateText(display)
    } else if (resolveState(stateText) !== undefined) {
      setStateText('')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, question.kind])

  const stateUnknown =
    question.kind === 'state' && stateText.trim() !== '' && resolveState(stateText) === undefined

  const renderPreferNot = () => {
    if (!question.preferNotToSay) return null
    const selected = value === undefined
    return (
      <button
        type="button"
        className="choice mt-2"
        data-selected={selected}
        data-tone="muted"
        onClick={() => onChange(undefined)}
      >
        <span className="mt-0.5 size-4 shrink-0 rounded-full border border-muted" aria-hidden />
        <span className="text-sm text-muted">{t('discover.preferNot')}</span>
      </button>
    )
  }

  return (
    <fieldset className="space-y-3" aria-describedby={`${groupId}-help`}>
      <legend className="font-display text-lg font-semibold text-navy sm:text-xl">
        {label}
        {question.skippable && (
          <span className="ml-2 text-xs font-medium text-muted">({t('common.optional')})</span>
        )}
      </legend>

      {(help || why) && (
        <div className="flex flex-wrap items-start gap-2 text-sm leading-relaxed text-muted">
          <HelpCircle size={15} className="mt-0.5 shrink-0" aria-hidden />
          <p id={`${groupId}-help`}>
            {why && (
              <>
                <span className="font-semibold text-navy">{t('discover.whyWeAsk')}: </span>
                {why}{' '}
              </>
            )}
            {help}
          </p>
          <SpeakButton text={`${label}. ${why ?? ''} ${help ?? ''}`.trim()} />
        </div>
      )}

      {question.kind === 'state' && (
        <div>
          <input
            list={`${groupId}-states`}
            className="input"
            value={stateText}
            onChange={(event) => {
              const text = event.target.value
              setStateText(text)
              onChange(resolveState(text))
            }}
            onBlur={() => {
              const resolved = resolveState(stateText)
              if (resolved) setStateText(stateName(resolved, lang))
            }}
            placeholder={t('discover.statePlaceholder')}
            aria-label={t('discover.statePlaceholder')}
            autoComplete="off"
          />
          <datalist id={`${groupId}-states`}>
            {STATE_CODES.map((code) => (
              <option key={code} value={stateName(code, lang)}>
                {code}
              </option>
            ))}
          </datalist>
          {stateUnknown && <p className="mt-1 text-xs font-medium text-warn">{t('discover.stateUnknown')}</p>}
        </div>
      )}

      {question.kind === 'text' && (
        <input
          className="input"
          type="text"
          value={typeof value === 'string' ? value : ''}
          onChange={(event) => onChange(event.target.value || undefined)}
          placeholder={t('discover.skip')}
        />
      )}

      {question.kind === 'number' && (
        <div className="flex items-center gap-3">
          <input
            className="input max-w-[10rem]"
            type="number"
            inputMode="decimal"
            min={question.min}
            max={question.max}
            value={typeof value === 'number' ? value : ''}
            onChange={(event) => {
              const raw = event.target.value
              if (raw === '') return onChange(undefined)
              const parsed = Number(raw)
              onChange(Number.isNaN(parsed) ? undefined : parsed)
            }}
            aria-invalid={Boolean(error)}
          />
          {question.suffix && <span className="text-sm text-muted">{pick(question.suffix)}</span>}
        </div>
      )}

      {question.kind === 'boolean' && (
        <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-labelledby={groupId}>
          <button
            type="button"
            className="choice"
            data-selected={value === true}
            onClick={() => onChange(true)}
          >
            <span className="mt-0.5 size-4 shrink-0 rounded-full border border-navy" aria-hidden />
            <span className="font-medium">{t('common.yes')}</span>
          </button>
          <button
            type="button"
            className="choice"
            data-selected={value === false}
            onClick={() => onChange(false)}
          >
            <span className="mt-0.5 size-4 shrink-0 rounded-full border border-navy" aria-hidden />
            <span className="font-medium">{t('common.no')}</span>
          </button>
        </div>
      )}

      {question.kind === 'single' && question.options && (
        <div className="grid gap-2" role="radiogroup" aria-labelledby={groupId}>
          {question.options.map((option) => (
            <button
              key={option.value}
              type="button"
              className="choice"
              data-selected={value === option.value}
              onClick={() => onChange(option.value)}
            >
              <span className="mt-0.5 size-4 shrink-0 rounded-full border border-navy" aria-hidden />
              <span className="font-medium">{pick(option.label)}</span>
            </button>
          ))}
        </div>
      )}

      {renderPreferNot()}

      {error && <p className="text-sm font-medium text-danger">{error}</p>}
    </fieldset>
  )
}
