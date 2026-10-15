import { lazy, Suspense, useEffect } from 'react'
import AppShell from './AppShell.tsx'
import { useHashRoute } from '../hooks/useHashRoute.ts'
import { I18nProvider } from '../i18n/I18nProvider.tsx'
import DirectoryPage from '../pages/DirectoryPage.tsx'
import DiscoverPage from '../pages/DiscoverPage.tsx'
import DocumentsPage from '../pages/DocumentsPage.tsx'
import FamilyPage from '../pages/FamilyPage.tsx'
import HomePage from '../pages/HomePage.tsx'
import PassportPage from '../pages/PassportPage.tsx'
import ReceiptPage from '../pages/ReceiptPage.tsx'
import ResultsPage from '../pages/ResultsPage.tsx'
import SchemePage from '../pages/SchemePage.tsx'

const AskPage = lazy(() => import('../pages/AskPage.tsx'))
const AdminPage = lazy(() => import('../pages/AdminPage.tsx'))
const AboutPage = lazy(() => import('../pages/AboutPage.tsx'))
const ComparePage = lazy(() => import('../pages/ComparePage.tsx'))

function RoutedApp() {
  const route = useHashRoute()
  const [first, second] = route.segments

  useEffect(() => {
    document.documentElement.dataset.inclusive ??= 'off'
    if ('serviceWorker' in navigator && import.meta.env.PROD) {
      navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {
        /* offline support unavailable */
      })
    }
  }, [])

  let page = <HomePage />
  if (first === 'discover') page = <DiscoverPage />
  else if (first === 'results') page = <ResultsPage />
  else if (first === 'scheme' && second) page = <SchemePage schemeId={second} />
  else if (first === 'receipt' && second) page = <ReceiptPage schemeId={second} />
  else if (first === 'documents' && second) page = <DocumentsPage schemeId={second} />
  else if (first === 'passport') page = <PassportPage />
  else if (first === 'directory') page = <DirectoryPage />
  else if (first === 'compare') page = <ComparePage />
  else if (first === 'family') page = <FamilyPage />
  else if (first === 'ask') page = <AskPage schemeId={second} />
  else if (first === 'admin') page = <AdminPage />
  else if (first === 'about') page = <AboutPage />

  return (
    <AppShell activePath={route.path}>
      <Suspense fallback={<div className="px-4 py-16 text-center text-sm text-muted">…</div>}>
        {page}
      </Suspense>
    </AppShell>
  )
}

export default function App() {
  return (
    <I18nProvider>
      <RoutedApp />
    </I18nProvider>
  )
}
