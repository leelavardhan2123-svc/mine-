import { useState } from 'react'
import { Download, Lock, ShieldCheck, Unlock, Upload } from 'lucide-react'
import { Callout, Card, SectionHeading, TrustPill } from '../components/ui/index.tsx'
import { ALL_SCHEMES } from '../data/index.ts'
import { applyOverlay, adminTokenConfigured, adminTokenMatches, overlayActive, readOverlay, writeOverlay } from '../services/admin.ts'
import type { AdminOverlay } from '../services/admin.ts'
import { useI18n } from '../i18n/useI18n.ts'
import { useAppState } from '../services/store.ts'

export default function AdminPage() {
  const { t, pick } = useI18n()
  const [token, setToken] = useState('')
  const [unlocked, setUnlocked] = useState(false)
  const [error, setError] = useState('')
  const [overlay, setOverlay] = useState<AdminOverlay>(() => readOverlay())
  const { metrics } = useAppState()

  if (!adminTokenConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <SectionHeading title={t('admin.title')} />
        <div className="mt-6">
          <Callout tone="warn" title={t('admin.locked')}>
            {t('admin.notConfigured')}
          </Callout>
        </div>
      </div>
    )
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <SectionHeading title={t('admin.title')} />
        <Card className="mt-6">
          <form
            onSubmit={(event) => {
              event.preventDefault()
              if (adminTokenMatches(token)) {
                setUnlocked(true)
                setError('')
              } else setError(t('admin.wrong'))
            }}
          >
            <label className="block text-xs font-semibold text-muted">
              {t('admin.passphrase')}
              <input
                className="input mt-1"
                type="password"
                value={token}
                onChange={(event) => setToken(event.target.value)}
                autoComplete="off"
              />
            </label>
            {error && <p className="mt-2 text-sm text-danger">{error}</p>}
            <button type="submit" className="btn btn-primary mt-4 w-full">
              <Unlock size={15} aria-hidden />
              {t('admin.unlock')}
            </button>
          </form>
          <p className="mt-4 text-xs leading-relaxed text-muted">{t('admin.localOnly')}</p>
        </Card>
      </div>
    )
  }

  const schemes = applyOverlay(ALL_SCHEMES, overlay)

  const patchScheme = (id: string, patch: AdminOverlay[string]) => {
    const next = { ...overlay, [id]: { ...overlay[id], ...patch } }
    setOverlay(next)
    writeOverlay(next)
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(overlay, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = 'sahayak-overlay.json'
    anchor.click()
    URL.revokeObjectURL(url)
  }

  const importJson = (file: File) => {
    void file.text().then((text) => {
      try {
        const parsed = JSON.parse(text) as AdminOverlay
        setOverlay(parsed)
        writeOverlay(parsed)
      } catch {
        window.alert(t('common.error'))
      }
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionHeading title={t('admin.title')} />
        <button type="button" className="btn btn-outline btn-sm" onClick={() => setUnlocked(false)}>
          <Lock size={14} aria-hidden />
          {t('admin.lock')}
        </button>
      </div>

      <div className="mt-4 space-y-3">
        <Callout tone="warn">{t('admin.localOnly')}</Callout>
        {overlayActive() && <Callout tone="info">{t('admin.overlayActive')}</Callout>}
      </div>

      <Card className="mt-4">
        <div className="flex flex-wrap items-center gap-3">
          <button type="button" className="btn btn-outline btn-sm" onClick={exportJson}>
            <Download size={14} aria-hidden />
            {t('admin.export')}
          </button>
          <label className="btn btn-outline btn-sm cursor-pointer">
            <Upload size={14} aria-hidden />
            {t('admin.import')}
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) importJson(file)
              }}
            />
          </label>
          <button
            type="button"
            className="btn btn-quiet btn-sm"
            onClick={() => {
              setOverlay({})
              writeOverlay({})
            }}
          >
            {t('admin.reset')}
          </button>
        </div>
      </Card>

      <Card className="mt-4">
        <p className="font-display text-base font-semibold">{t('admin.metrics')}</p>
        <div className="mt-3 grid grid-cols-2 gap-3 text-sm sm:grid-cols-5">
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className="rounded-xl bg-ivory px-3 py-2 text-center">
              <p className="font-display text-xl font-bold text-navy">{value}</p>
              <p className="text-[11px] text-muted">{key}</p>
            </div>
          ))}
        </div>
      </Card>

      <div className="mt-6">
        <h2 className="font-display text-lg font-semibold">{t('admin.catalog')}</h2>
        <div className="mt-3 space-y-2">
          {schemes.map((scheme) => {
            return (
              <Card key={scheme.id} className="!p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-navy">{pick(scheme.name)}</p>
                    <p className="text-xs text-muted">{scheme.id}</p>
                  </div>
                  <TrustPill status={scheme.verification} />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    className="btn btn-outline btn-sm"
                    onClick={() =>
                      patchScheme(scheme.id, { verification: 'verified', lastVerified: new Date().toISOString().slice(0, 10) })
                    }
                  >
                    <ShieldCheck size={13} aria-hidden />
                    {t('admin.markVerified')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-quiet btn-sm"
                    onClick={() => patchScheme(scheme.id, { verification: 'needs-reverification' })}
                  >
                    {t('admin.markReverify')}
                  </button>
                  <button
                    type="button"
                    className="btn btn-quiet btn-sm"
                    onClick={() =>
                      patchScheme(scheme.id, {
                        publication: scheme.publication === 'published' ? 'archived' : 'published',
                      })
                    }
                  >
                    {scheme.publication === 'published' ? t('admin.archive') : t('admin.publish')}
                  </button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
