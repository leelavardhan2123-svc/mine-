# Sahayak

**Every eligible citizen deserves to know.**

Sahayak is a citizen-facing discovery app for Indian government schemes, built for
the INNOHACKS 2.0 challenge. Answer a short guided questionnaire and get:

- **Eligibility matches** — a deterministic engine evaluates your answers against
  structured rules recorded from official sources.
- **An explainable receipt** — every match shows *why* it matched, what is still
  missing, and where to verify (source URL + last-verified date).
- **A document checklist** — tick off documents as you prepare them.
- **A scheme passport** — saved matches, benefits and application channels.
- **Telugu + English** — the whole UI switches language in one tap, with speak-aloud.
- **Family benefit map** — see which schemes may fit each family member.
- **Offline-lite** — a service worker keeps the shell usable without a network.

Sahayak is **not** a government body. It does not accept applications and cannot
approve benefits; every record links the official portal for the real step.

**Stack:** React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · Framer Motion · Lucide

---

## Run it locally

```bash
npm install
npm run dev
```

Open **http://localhost:5173** (the dev server).

| Command              | What it does                                   |
| -------------------- | ---------------------------------------------- |
| `npm run dev`        | Start the dev server                           |
| `npm run build`      | Type-check + production build into `dist/`     |
| `npm run preview`    | Serve the production build locally             |
| `npm run lint`       | Lint (oxlint) — keep it at zero warnings       |
| `npm run test:engine`| 16 unit tests for the eligibility engine       |
| `npm run smoke`      | 40 browser checks via Microsoft Edge (preview must be running) |

Smoke test expects a server at `http://localhost:4173` (or set `SMOKE_URL`):

```bash
npm run preview          # terminal 1
npm run smoke            # terminal 2
```

---

## How matching works

- Each scheme in `src/data/schemes/` carries `rules[]` — typed, structured
  conditions (age, income band, state, occupation, education, attributes…).
- `src/engine/eligibility.ts` evaluates answers against those rules:
  - a **required** rule fails → `not-matching`
  - nothing matched → `insufficient` (questions are listed as missing)
  - some required answers missing → `potential`
  - otherwise → `likely`
- Rules that must be checked by an office are `manual-verify` and always count as
  unknown — Sahayak never pretends to know them.
- Results sort strong matches first. No scores, no randomness, no popularity.

The AI explainer (`Ask`) only answers from the scheme record provided to it and
falls back to a grounded template when no server key is configured. The key stays
server-side in `api/explain.ts` (Vercel function) via `AI_API_KEY`.

---

## Data & honesty rules

- Every scheme record has: official source URL, verification status, last-verified
  date, administering body, document list and rule set.
- Statuses are `verified` / `needs-reverification` / `incomplete` / `archived` —
  set from actual source checks, never to look good. Archived schemes are flagged,
  not hidden.
- Never fabricate amounts, deadlines or URLs. Unverified benefit amounts are
  labelled as such (`trust.benefitsUnverified`).
- The admin overlay (`#/admin`, token from `VITE_ADMIN_TOKEN`, min 8 chars) only
  re-checks verification status and publish state — it cannot invent data.

---

## What is saved, and where

Everything stays in the browser under the `sahayak:` prefix in `localStorage`:

| Key                     | Purpose                                   |
| ----------------------- | ----------------------------------------- |
| `sahayak:answers`       | Your questionnaire answers                |
| `sahayak:passport`      | Saved schemes and receipts                |
| `sahayak:profiles`      | Family member profiles                    |
| `sahayak:ready-docs`    | Document readiness ticks                  |
| `sahayak:metrics`       | Local usage counters (no tracking)        |
| `sahayak:lang` / `inclusive` | Language and large-text preference    |

No server, no accounts, no Aadhaar/OTP/bank details — ever. The footer's
"clear my data" wipes all of it.

---

## Project structure

```
api/explain.ts            Server-side AI explainer (keeps API keys off the client)
scripts/smoke-test.mjs    Playwright (Edge) smoke test
tests/engine.test.ts      Engine unit tests (node --test)
public/sw.js              Offline-lite service worker
src/
  app/App.tsx             Hash router  (/, /discover, /results, /scheme/:id,
                         /receipt/:id, /documents/:id, /passport, /directory,
                         /compare, /family, /ask/:id?, /admin, /about)
  app/AppShell.tsx        Header, nav, language switch, footer + disclaimer
  data/                   Scheme catalogue, questions, documents, personas
  engine/eligibility.ts   Deterministic rule evaluation
  i18n/                   en.ts + te.ts dictionaries, provider, hooks
  pages/                  One file per route
  services/               localStorage, store, metrics, passport, admin, ai, speech
  components/             QuestionField, SchemeCard, ui primitives
```

---

## Deploy

**GitHub Pages** (already wired): push to `main` → `.github/workflows/deploy.yml`
builds and publishes. `vite.config.ts` keeps `base: '/mine-/'` for Pages.

**Vercel**: import the repo; `VERCEL=1` switches the base to `/` automatically,
and `api/explain.ts` deploys as a serverless function (set `AI_API_KEY`).
