import { chromium } from 'playwright-core'

const BASE = process.env.SMOKE_URL ?? 'http://localhost:4173'
let passed = 0
let failed = 0
const failures = []

function check(name, ok, detail = '') {
  if (ok) {
    passed += 1
    console.log(`  ✓ ${name}`)
  } else {
    failed += 1
    failures.push(name)
    console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
  }
}

async function vis(locator, timeout = 8000) {
  return locator.waitFor({ state: 'visible', timeout }).then(
    () => true,
    () => false,
  )
}

const browser = await chromium.launch({
  channel: 'msedge',
  headless: true,
})
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })
const errors = []
page.on('pageerror', (error) => errors.push(String(error)))
page.on('console', (message) => {
  if (message.type() === 'error') errors.push(message.text())
})

try {
  console.log(`Smoke testing ${BASE}`)

  await page.goto(BASE, { waitUntil: 'networkidle' })
  check('home loads', (await page.title()).toLowerCase().includes('sahayak'))
  check('home shows tagline', await vis(page.getByText('Every eligible citizen').first()))
  check('language switch present', await vis(page.locator('[role="group"] button[aria-pressed]').first()))
  check('disclaimer visible', await vis(page.getByText(/not a government authority/i).first()))
  check('about entry point present', await vis(page.getByRole('button', { name: /about/i }).first()))

  await page.getByRole('button', { name: /find schemes|discover|start/i }).first().click()
  await page.waitForTimeout(400)
  check('questionnaire opens', await vis(page.getByText(/step|question/i).first()))

  const next = page.getByRole('button', { name: /next|continue/i }).first()
  let stepsDone = 0
  for (let i = 0; i < 6 && (await vis(next, 2500)); i += 1) {
    const choice = page.locator('.choice').first()
    if (await vis(choice, 2500)) await choice.click()
    await next.click()
    stepsDone += 1
    await page.waitForTimeout(250)
  }
  check('questionnaire advances', stepsDone >= 3, `only ${stepsDone} steps`)

  const resultsButton = page.getByRole('button', { name: /results|see matches/i }).first()
  if (await vis(resultsButton, 4000)) {
    await resultsButton.click()
    await page.waitForTimeout(500)
  } else {
    await page.goto(`${BASE}/#/results`, { waitUntil: 'networkidle' })
  }
  check('results page renders cards', await vis(page.locator('.card').first()))
  const radarPills = await page.locator('text=/strong|possible|needs info/i').count()
  check('results show radar groups', radarPills > 0)

  await page.goto(`${BASE}/#/directory`, { waitUntil: 'networkidle' })
  const cards = await vis(page.locator('.card').first()).then((ok) => (ok ? page.locator('.card').count() : 0))
  check('directory lists schemes', cards > 10, `only ${cards} cards`)
  await page.getByPlaceholder(/search/i).fill('PM-KISAN')
  await page.waitForTimeout(300)
  const filtered = await page.locator('.card').count()
  check('directory search filters', filtered > 0 && filtered < cards, `${filtered}/${cards}`)

  await page.goto(`${BASE}/#/scheme/pm-kisan`, { waitUntil: 'networkidle' })
  check('scheme page renders', await vis(page.getByText(/PM-KISAN/i).first()))
  check('scheme shows official source', (await page.locator('a[target="_blank"][href^="http"]').count()) > 0)
  check('scheme shows last verified', await vis(page.getByText(/verified/i).first()))

  await page.goto(`${BASE}/#/receipt/pm-kisan`, { waitUntil: 'networkidle' })
  check('receipt page renders', await vis(page.locator('main')))

  await page.goto(`${BASE}/#/passport`, { waitUntil: 'networkidle' })
  check('passport renders', await vis(page.getByText(/passport|your schemes/i).first()))

  await page.goto(`${BASE}/#/documents/pm-kisan`, { waitUntil: 'networkidle' })
  const docToggles = page.locator('main button[aria-pressed]')
  check('document checklist renders', (await vis(docToggles.first())) && (await docToggles.count()) > 0)
  const firstDoc = docToggles.first()
  const wasReady = await firstDoc.getAttribute('aria-pressed')
  await firstDoc.click()
  await page.waitForTimeout(200)
  check('document readiness toggles', (await firstDoc.getAttribute('aria-pressed')) !== wasReady)

  await page.goto(`${BASE}/#/family`, { waitUntil: 'networkidle' })
  check('family map renders', await vis(page.getByText(/family|member/i).first()))

  await page.goto(`${BASE}/#/ask/pm-kisan`, { waitUntil: 'networkidle' })
  check('ask page renders', await vis(page.getByText(/ask about schemes|ask/i).first()))

  await page.goto(`${BASE}/#/compare`, { waitUntil: 'networkidle' })
  check('compare page renders', await vis(page.getByText(/compare/i).first()))

  await page.goto(`${BASE}/#/about`, { waitUntil: 'networkidle' })
  check('about page privacy note', await vis(page.getByText(/stay on this device/i).first()))
  check('about page not-government note', await vis(page.getByText(/not a government body/i).first()))

  const switcher = page.locator('[role="group"] button[aria-pressed]').first().locator('..')
  const textBefore = await page.locator('main').innerText()
  await switcher.locator('button').nth(1).click()
  await page.waitForTimeout(300)
  const textAfter = await page.locator('main').innerText()
  check('telugu switch changes language', textAfter !== textBefore && textAfter.length > 0)
  await switcher.locator('button').nth(0).click()
  await page.waitForTimeout(300)
  const textBack = await page.locator('main').innerText()
  check('switch back to english', textBack === textBefore)

  await page.goto(`${BASE}/#/admin`, { waitUntil: 'networkidle' })
  check('admin without token is locked', await vis(page.getByText(/passphrase|not configured/i).first()))

  const assistantButton = page.getByRole('button', { name: /open sahayak ai assistant/i })
  check('assistant floating button present', await vis(assistantButton))
  await assistantButton.click()
  check('assistant panel opens', await vis(page.getByRole('region', { name: /sahayak ai/i })))
  check('assistant greets user', await vis(page.getByText(/hello/i).first()))
  await page.getByRole('button', { name: /what is pm-kisan/i }).click()
  check('assistant answers scheme question', await vis(page.getByText(/PM-KISAN/i).last(), 12000))
  await page.getByRole('button', { name: /close assistant/i }).first().click()

  check('no console/page errors', errors.length === 0, errors.slice(0, 3).join(' | '))
} finally {
  await browser.close()
}

console.log(`\n${passed} passed, ${failed} failed`)
if (failed > 0) {
  console.log(`Failures: ${failures.join(', ')}`)
  process.exit(1)
}
