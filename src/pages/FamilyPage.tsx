import { useMemo, useState } from 'react'
import { Plus, Trash2, Users } from 'lucide-react'
import { QuestionField } from '../components/QuestionField.tsx'
import { Callout, Card, EmptyState, RadarPill, SectionHeading } from '../components/ui/index.tsx'
import { QUESTIONS, getAnswerValue, setAnswerValue } from '../data/questions.ts'
import { ACTIVE_SCHEMES } from '../data/index.ts'
import { assessAll, sortAssessments } from '../engine/eligibility.ts'
import type { Answers } from '../data/types.ts'
import { navigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import type { FamilyMemberType } from '../services/profiles.ts'
import { actions, useAppState } from '../services/store.ts'

const MEMBER_TYPES: FamilyMemberType[] = ['student', 'farmer', 'senior', 'woman', 'worker', 'business', 'other']

const MEMBER_LABEL_KEY = {
  student: 'family.member.student',
  farmer: 'family.member.farmer',
  senior: 'family.member.senior',
  woman: 'family.member.woman',
  worker: 'family.member.worker',
  business: 'family.member.business',
  other: 'family.member.other',
} as const

export default function FamilyPage() {
  const { t, pick } = useI18n()
  const { profiles } = useAppState()
  const [editing, setEditing] = useState<Answers | null>(null)
  const [label, setLabel] = useState('')
  const [memberType, setMemberType] = useState<FamilyMemberType>('student')
  const [expanded, setExpanded] = useState<string | null>(null)

  const visibleQuestions = useMemo(
    () => (editing ? QUESTIONS.filter((q) => !q.showWhen || q.showWhen(editing)) : []),
    [editing],
  )

  const addProfile = () => {
    if (!editing) return
    actions.addProfile({
      label: label.trim() || t(MEMBER_LABEL_KEY[memberType]),
      memberType,
      answers: editing,
    })
    setEditing(null)
    setLabel('')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <SectionHeading title={t('family.title')} subtitle={t('family.subtitle')} />

      <div className="mt-4">
        <Callout tone="warn">{t('family.warning')}</Callout>
      </div>

      {profiles.length === 0 && !editing && (
        <div className="mt-6">
          <EmptyState
            title={t('family.empty')}
            body={t('family.emptyHint')}
            action={
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setEditing({ attributes: {} })}
              >
                <Plus size={16} aria-hidden />
                {t('family.add')}
              </button>
            }
          />
        </div>
      )}

      {profiles.length > 0 && !editing && (
        <>
          <div className="mt-6 flex items-center justify-between">
            <h2 className="font-display text-lg font-semibold">{t('family.overview')}</h2>
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setEditing({ attributes: {} })}
            >
              <Plus size={14} aria-hidden />
              {t('family.add')}
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {profiles.map((profile) => {
              const assessments = sortAssessments(assessAll(ACTIVE_SCHEMES, profile.answers))
              const strong = assessments.filter((a) => a.radar === 'strong')
              const possible = assessments.filter((a) => a.radar === 'possible')
              const isOpen = expanded === profile.id
              return (
                <Card key={profile.id}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="flex items-center gap-2 font-display text-base font-semibold text-navy">
                        <Users size={16} aria-hidden />
                        {profile.label}
                      </p>
                      <p className="text-xs text-muted">{t(MEMBER_LABEL_KEY[profile.memberType])}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => setExpanded(isOpen ? null : profile.id)}
                      >
                        {isOpen ? t('common.showLess') : t('family.results')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-quiet btn-sm text-danger"
                        onClick={() => actions.removeProfile(profile.id)}
                      >
                        <Trash2 size={14} aria-hidden />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="pill pill-emerald">{strong.length} {t('radar.strong.title')}</span>
                    <span className="pill pill-saffron">{possible.length} {t('radar.possible.title')}</span>
                  </div>

                  {isOpen && (
                    <div className="mt-3 space-y-2 border-t border-line pt-3">
                      {[...strong, ...possible].slice(0, 8).map((assessment) => {
                        const scheme = ACTIVE_SCHEMES.find((s) => s.id === assessment.schemeId)!
                        return (
                          <div key={assessment.schemeId} className="flex items-center justify-between gap-2 text-sm">
                            <button
                              type="button"
                              className="truncate text-left font-medium text-navy hover:underline"
                              onClick={() => navigate(`/scheme/${scheme.id}`)}
                            >
                              {pick(scheme.name)}
                            </button>
                            <RadarPill group={assessment.radar} />
                          </div>
                        )
                      })}
                      {strong.length + possible.length === 0 && (
                        <p className="text-sm text-muted">{t('results.noneHint')}</p>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </>
      )}

      {editing && (
        <Card className="mt-6">
          <h2 className="font-display text-lg font-semibold">{t('family.add')}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-muted">
              {t('family.profileLabel')}
              <input
                className="input mt-1"
                value={label}
                placeholder={t('family.profileLabelPlaceholder')}
                onChange={(event) => setLabel(event.target.value)}
              />
            </label>
            <label className="block text-xs font-semibold text-muted">
              {t('family.memberType')}
              <select
                className="input mt-1"
                value={memberType}
                onChange={(event) => setMemberType(event.target.value as FamilyMemberType)}
              >
                {MEMBER_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {t(MEMBER_LABEL_KEY[type])}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-6 space-y-6">
            {visibleQuestions.map((question) => (
              <QuestionField
                key={question.id}
                question={question}
                value={getAnswerValue(editing, question.id) as string | number | boolean | undefined}
                onChange={(value) => setEditing((current) => (current ? setAnswerValue(current, question.id, value) : current))}
              />
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <button type="button" className="btn btn-primary" onClick={addProfile}>
              {t('common.save')}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => setEditing(null)}>
              {t('common.cancel')}
            </button>
          </div>
          <p className="mt-3 text-xs text-muted">{t('family.privacyNote')}</p>
        </Card>
      )}
    </div>
  )
}
