import { useMemo } from 'react'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  FileCheck2,
  GraduationCap,
  HeartHandshake,
  House,
  Languages,
  Lock,
  Search,
  ShieldCheck,
  Sprout,
  Store,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useNavigate } from '../hooks/useHashRoute.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { useAppState, actions } from '../services/store.ts'
import { ACTIVE_SCHEMES, CATEGORY_IDS, countByCategory } from '../data/index.ts'
import { PERSONAS } from '../data/personas.ts'
import { assessAll, sortAssessments } from '../engine/eligibility.ts'
import type { CategoryId } from '../data/types.ts'
import { Callout, Card, SectionHeading } from '../components/ui/index.tsx'

const CATEGORY_ICONS: Record<CategoryId, LucideIcon> = {
  education: GraduationCap,
  agriculture: Sprout,
  employment: Briefcase,
  'women-family': HeartHandshake,
  'social-security': ShieldCheck,
  entrepreneurship: Store,
  'housing-services': House,
}

export default function HomePage() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { metrics } = useAppState()

  const counts = useMemo(() => countByCategory(ACTIVE_SCHEMES), [])

  const demo = useMemo(() => {
    const farmer = PERSONAS.find((persona) => persona.id === 'farmer')!
    const assessments = sortAssessments(assessAll(ACTIVE_SCHEMES, farmer.answers))
    const strong = assessments.filter((a) => a.radar === 'strong')
    const possible = assessments.filter((a) => a.radar === 'possible')
    return { strong, possible, sample: [...strong, ...possible].slice(0, 3) }
  }, [])

  const loadPersona = (personaId: string) => {
    const persona = PERSONAS.find((entry) => entry.id === personaId)
    if (!persona) return
    actions.setAnswers(persona.answers)
    actions.recordAssessment()
    navigate('/results')
  }

  return (
    <div>
      <section className="surface-warm border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.15fr_0.85fr] md:py-20">
          <div>
            <span className="pill pill-saffron">{t('app.name')} · {t('app.tagline')}</span>
            <h1 className="mt-4 font-display text-3xl font-bold leading-tight text-navy sm:text-5xl">
              {t('home.hero.headline')}
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              {t('home.hero.sub')}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button type="button" className="btn btn-primary" onClick={() => navigate('/discover')}>
                {t('home.hero.ctaPrimary')}
                <ArrowRight size={16} aria-hidden />
              </button>
              <button type="button" className="btn btn-outline" onClick={() => navigate('/directory')}>
                <Search size={16} aria-hidden />
                {t('home.hero.ctaSecondary')}
              </button>
            </div>
            <p className="mt-6 max-w-xl text-xs leading-relaxed text-muted">{t('footer.disclaimer')}</p>
          </div>

          <Card className="relative overflow-hidden">
            <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-saffron-deep">
              {t('home.hero.preview')}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t('home.hero.previewNote')}</p>
            <div className="mt-4 space-y-2">
              {demo.sample.map((assessment) => {
                const scheme = ACTIVE_SCHEMES.find((entry) => entry.id === assessment.schemeId)!
                return (
                  <div
                    key={assessment.schemeId}
                    className="flex items-center justify-between gap-3 rounded-xl border border-line bg-ivory px-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-navy">{scheme.name.en}</p>
                      <p className="truncate text-xs text-muted">
                        {assessment.matched.length} criteria matched ·{' '}
                        {assessment.unknown.length} to verify
                      </p>
                    </div>
                    <span
                      className={`pill ${assessment.radar === 'strong' ? 'pill-emerald' : 'pill-saffron'}`}
                    >
                      {t(`radar.${assessment.radar === 'strong' ? 'strong' : 'possible'}.title`)}
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="mt-4 text-xs text-muted">
              Live result of running the farmer persona through the eligibility engine — not a
              screenshot.
            </p>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading title={t('home.how.title')} />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            { icon: Users, ...{ title: t('home.how.step1.title'), body: t('home.how.step1.body') } },
            { icon: ShieldCheck, ...{ title: t('home.how.step2.title'), body: t('home.how.step2.body') } },
            { icon: FileCheck2, ...{ title: t('home.how.step3.title'), body: t('home.how.step3.body') } },
          ].map((step) => (
            <Card key={step.title}>
              <div className="grid size-10 place-items-center rounded-xl bg-navy text-white">
                <step.icon size={18} aria-hidden />
              </div>
              <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <SectionHeading title={t('home.categories.title')} />
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORY_IDS.map((category) => {
              const Icon = CATEGORY_ICONS[category]
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => navigate(`/directory?category=${category}`)}
                  className="card-flat group flex items-center gap-3 px-4 py-4 text-left transition hover:border-navy/40"
                >
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-ivory-deep text-navy">
                    <Icon size={18} aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold text-navy">
                      {t(`category.${category}`)}
                    </span>
                    <span className="block text-xs text-muted">
                      {counts[category]} {t('directory.results')}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionHeading title={t('home.personas.title')} subtitle={t('home.personas.note')} />
        <div className="mt-8 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {PERSONAS.map((persona) => (
            <Card key={persona.id} className="flex flex-col">
              <p className="font-display text-base font-semibold text-navy">{t(persona.labelKey)}</p>
              <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{t(persona.descKey)}</p>
              <button
                type="button"
                className="btn btn-outline btn-sm mt-4 self-start"
                onClick={() => loadPersona(persona.id)}
              >
                {t('home.personas.load')}
                <ArrowRight size={14} aria-hidden />
              </button>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-2">
          <div>
            <SectionHeading eyebrow={t('privacy.title')} title={t('home.trust.title')} />
            <ul className="mt-6 space-y-3 text-sm leading-relaxed text-muted">
              {[
                t('home.trust.point1'),
                t('home.trust.point2'),
                t('home.trust.point3'),
                t('home.trust.point4'),
              ].map((point) => (
                <li key={point} className="flex gap-2">
                  <Lock size={15} className="mt-0.5 shrink-0 text-emerald" aria-hidden />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => navigate('/about')}>
                <BookOpen size={14} aria-hidden />
                {t('nav.about')}
              </button>
              <button type="button" className="btn btn-quiet btn-sm" onClick={() => navigate('/directory')}>
                <Languages size={14} aria-hidden />
                {t('directory.title')}
              </button>
            </div>
          </div>
          <div>
            <Card>
              <p className="font-display text-lg font-semibold text-navy">{t('home.metrics.title')}</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                <div className="rounded-xl bg-ivory px-2 py-3">
                  <p className="font-display text-2xl font-bold text-navy">{metrics.assessments}</p>
                  <p className="mt-1 text-[11px] leading-tight text-muted">
                    {t('home.metrics.assessments')}
                  </p>
                </div>
                <div className="rounded-xl bg-ivory px-2 py-3">
                  <p className="font-display text-2xl font-bold text-navy">{metrics.passportSaves}</p>
                  <p className="mt-1 text-[11px] leading-tight text-muted">{t('home.metrics.saved')}</p>
                </div>
                <div className="rounded-xl bg-ivory px-2 py-3">
                  <p className="font-display text-2xl font-bold text-navy">{metrics.docsReady}</p>
                  <p className="mt-1 text-[11px] leading-tight text-muted">{t('home.metrics.docs')}</p>
                </div>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-muted">{t('home.metrics.note')}</p>
            </Card>
            <div className="mt-4">
              <Callout tone="warn">{t('footer.notOfficial')}</Callout>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
