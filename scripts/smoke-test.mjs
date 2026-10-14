/**
 * End-to-end smoke test for Forever With You ❤️
 *
 * Uses the system Microsoft Edge (no browser download needed).
 * Start the dev server first:  npm run dev
 * Then run:                    node scripts/smoke-test.mjs
 *
 * Verifies: no JS/console errors, every feature opens and closes,
 * keyboard controls work, preferences persist — and captures screenshots.
 */
import { mkdirSync } from 'node:fs'
import { chromium } from 'playwright-core'

const EDGE =
  process.env.EDGE_PATH ??
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const SHOTS = process.env.SHOTS_DIR ?? 'scripts/shots'

mkdirSync(SHOTS, { recursive: true })

const consoleErrors = []
const pageErrors = []
const results = []
let failures = 0

const pass = (name, ok, extra = '') => {
  if (!ok) failures += 1
  results.push(`${ok ? 'PASS' : 'FAIL'}  ${name}${extra ? ` — ${extra}` : ''}`)
}

const browser = await chromium.launch({ executablePath: EDGE, headless: true })
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
})
const page = await context.newPage()

page.on('console', (message) => {
  if (message.type() === 'error') consoleErrors.push(message.text())
})
page.on('pageerror', (error) => pageErrors.push(String(error)))

const shot = async (name) => {
  await page.screenshot({ path: `${SHOTS}/${name}.png` })
  results.push(`shot  ${name}.png`)
}

const settle = (ms = 900) => page.waitForTimeout(ms)

try {
  /* ── Feature 1 · Welcome ─────────────────────────────────── */
  await page.goto(BASE, { waitUntil: 'load', timeout: 30_000 })
  await page.evaluate(() => document.fonts?.ready)
  await settle(1200)

  const heading = await page.locator('h1').first().textContent()
  pass('welcome heading rendered', heading?.includes('Favorite Person'), heading)
  await shot('01-welcome')

  await page.getByRole('button', { name: /Open Your Surprise/ }).click()
  await settle(2400)

  const opened = await page.evaluate(
    () => localStorage.getItem('forever-with-you:opened') === 'true',
  )
  pass('welcome click opens experience + persists', opened)
  await shot('02-intro')

  const sections = await page.evaluate(() =>
    ['story', 'letter', 'gallery', 'special', 'surprise', 'final'].filter(
      (id) => !document.getElementById(id),
    ),
  )
  pass('all sections exist', sections.length === 0, `missing: ${sections}`)

  /* ── Feature 2 · Love story timeline ─────────────────────── */
  await page.locator('#story').scrollIntoViewIfNeeded()
  await settle(1100)
  const milestoneCount = await page.locator('#story li').count()
  pass('timeline shows 5 milestones', milestoneCount === 5, String(milestoneCount))
  await shot('03-love-story')

  /* ── Feature 3 · Envelope + letter ───────────────────────── */
  await page.locator('#letter').scrollIntoViewIfNeeded()
  await settle(800)
  await page
    .getByRole('button', { name: /Open the love letter/ })
    .click()
  await settle(1400)
  const skip = page.getByRole('button', { name: /Skip the writing/ })
  if (await skip.count()) await skip.click()
  await settle(400)
  const letterText = await page.locator('#letter article').textContent()
  pass(
    'letter opens and reveals full text',
    (letterText ?? '').includes('You are someone truly special to me'),
  )
  pass(
    'letter signature shown',
    (letterText ?? '').includes('Forever yours'),
  )
  await shot('04-letter')

  await page.getByRole('button', { name: /Close the letter/ }).click()
  await settle(700)
  pass(
    'letter closes back to envelope',
    (await page.getByRole('button', { name: /Open the love letter/ }).count()) === 1,
  )

  /* ── Feature 4 · Gallery + lightbox ──────────────────────── */
  await page.locator('#gallery').scrollIntoViewIfNeeded()
  await settle(1000)
  const galleryButtons = await page
    .getByRole('button', { name: /Open memory:/ })
    .count()
  pass('gallery renders photos', galleryButtons === 6, String(galleryButtons))
  await shot('05-gallery')

  await page.getByRole('button', { name: /Open memory:/ }).first().click()
  await settle(700)
  pass(
    'lightbox opens',
    (await page.getByRole('dialog').count()) === 1,
  )
  await shot('06-lightbox')
  await page.keyboard.press('ArrowRight')
  await settle(500)
  await page.keyboard.press('Escape')
  await settle(500)
  pass('lightbox closes with Escape', (await page.getByRole('dialog').count()) === 0)

  /* ── Feature 5 · Why you are special ─────────────────────── */
  await page.locator('#special').scrollIntoViewIfNeeded()
  await settle(900)
  const card = page.getByRole('button', { name: /^Reveal reason 1/ })
  await card.click()
  await settle(1100)
  pass(
    'card flips on click',
    (await page.getByRole('button', { name: /Hide reason/ }).count()) === 1,
  )
  const revealed = await page.evaluate(
    () =>
      JSON.parse(localStorage.getItem('forever-with-you:revealed') ?? '[]')
        .length === 1,
  )
  pass('revealed card persists locally', revealed)
  await shot('07-why-special')

  /* ── Feature 6 · One last surprise ───────────────────────── */
  await page.locator('#surprise').scrollIntoViewIfNeeded()
  await settle(700)
  await page.getByRole('button', { name: /One Last Surprise/ }).click()
  await settle(1800)
  const message = await page.getByRole('dialog').textContent()
  pass(
    'surprise message shown',
    (message ?? '').includes('see yourself through my eyes'),
  )
  await shot('08-surprise')
  await page.keyboard.press('Escape')
  await settle(1200) // spring exit finishes ~600ms after the key press
  pass('surprise closes with Escape', (await page.getByRole('dialog').count()) === 0)

  /* ── Feature 7 · Music (manual start) ────────────────────── */
  const play = page.getByRole('button', { name: 'Play music' })
  pass('music player available', (await play.count()) === 1)
  if (await play.count()) {
    await play.click()
    await settle(900)
    const paused = await page.getByRole('button', { name: 'Pause music' }).count()
    pass('music starts on click (no autoplay)', paused === 1)
    if (paused) await page.getByRole('button', { name: 'Pause music' }).click()
  }

  /* ── Feature 9 · Final screen ────────────────────────────── */
  await page.locator('#final').scrollIntoViewIfNeeded()
  await settle(1100)
  const finalText = await page.locator('#final').textContent()
  pass(
    'final message shown',
    (finalText ?? '').includes("I'm glad ours is part of my life"),
  )
  await shot('09-final')

  await page.getByRole('button', { name: /Revisit our memories/ }).click()
  await settle(1400)
  const atStory = await page.evaluate(() => {
    const el = document.getElementById('story')
    if (!el) return false
    const rect = el.getBoundingClientRect()
    return rect.top > -400 && rect.top < 400
  })
  pass('revisit button scrolls to memories', atStory)

  /* ── Footer · start over ─────────────────────────────────── */
  await page.locator('footer').scrollIntoViewIfNeeded()
  await settle(600)
  page.once('dialog', (dialog) => dialog.accept())
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'load', timeout: 15_000 }),
    page.getByRole('button', { name: /Start over/ }).click(),
  ])
  await settle(600)
  const cleared = await page.evaluate(
    () => localStorage.getItem('forever-with-you:opened') !== 'true',
  )
  pass('start over clears saved preferences', cleared)
  pass(
    'start over returns to the welcome screen',
    (await page.locator('h1').first().textContent())?.includes('Favorite Person'),
  )

  /* ── Mobile pass ─────────────────────────────────────────── */
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto(BASE, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts?.ready)
  await settle(1200)
  await page.getByRole('button', { name: /Open Your Surprise/ }).click()
  await settle(2400)
  await shot('10-mobile-intro')
  await page.locator('#story').scrollIntoViewIfNeeded()
  await settle(900)
  await shot('11-mobile-story')
  await page.locator('#gallery').scrollIntoViewIfNeeded()
  await settle(900)
  await shot('12-mobile-gallery')

  const hasHScroll = await page.evaluate(
    () => document.documentElement.scrollWidth > window.innerWidth + 2,
  )
  pass('no horizontal overflow on mobile', !hasHScroll)
} catch (error) {
  failures += 1
  results.push(`FAIL  unhandled error — ${error?.message ?? error}`)
} finally {
  /* ── Console health ──────────────────────────────────────── */
  const realErrors = consoleErrors.filter(
    (text) => !/net::ERR|Failed to load resource|fonts\./i.test(text),
  )
  pass('no JavaScript page errors', pageErrors.length === 0, pageErrors.join(' | '))
  pass('no console errors', realErrors.length === 0, realErrors.join(' | '))
  if (consoleErrors.length) {
    results.push(`info  ${consoleErrors.length} network/resource note(s)`)
  }

  await browser.close()

  console.log('\n──────── smoke test report ────────')
  results.forEach((line) => console.log(line))
  console.log(
    `\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} FAILURE(S)`} · screenshots in ${SHOTS}`,
  )
  process.exit(failures === 0 ? 0 : 1)
}
