import { AlertTriangle, ShieldCheck } from 'lucide-react'
import { Callout, Card, SectionHeading } from '../components/ui/index.tsx'
import { useI18n } from '../i18n/useI18n.ts'

export default function AboutPage() {
  const { t } = useI18n()
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <SectionHeading title={t('about.title')} subtitle={t('app.tagline')} />

      <div className="mt-6 space-y-4">
        <Card>
          <h3 className="flex items-center gap-2 font-display text-lg font-semibold">
            <ShieldCheck size={18} className="text-emerald" aria-hidden />
            {t('privacy.title')}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{t('privacy.body')}</p>
        </Card>

        <Card>
          <p className="text-sm leading-relaxed text-muted">{t('about.mission')}</p>
        </Card>

        <Card>
          <p className="text-sm leading-relaxed text-muted">{t('about.howMatching')}</p>
        </Card>

        <Card>
          <p className="text-sm leading-relaxed text-muted">{t('about.data')}</p>
        </Card>

        <Callout tone="warn" title={t('about.notGovt')}>
          <AlertTriangle size={14} aria-hidden className="mt-1" />
        </Callout>

        <p className="text-xs text-muted">{t('about.contact')}</p>
      </div>
    </div>
  )
}
