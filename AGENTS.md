# AGENTS.md — Sahara (INNOHACKS 2.0)

Citizen-facing Indian government scheme discovery app: guided questionnaire →
deterministic eligibility engine → explainable receipts, scheme passport,
document readiness, 11-language i18n, AI explainer, family benefit map,
offline-lite, admin overlay. User: **leelavardhan**, beginner — explain simply.

## Commands
- `npm run dev` → http://localhost:5173
- `npm run lint` / `npm run build` / `npm run test:engine` (16 Node unit tests)
- `npm run preview` (port 4173) then `npm run smoke` (42-check Playwright/Edge test, `SMOKE_URL` override)
- Edits must pass `npm run lint && npm run build && npm run test:engine`

## Project facts
- React 19 + TS 6 (strict, `verbatimModuleSyntax`, `import type`) + Vite 8 + Tailwind 4 + oxlint
- Hash routing (`useHashRoute`): `/, /discover, /results, /scheme/:id, /receipt/:id,
  /documents/:id, /roadmap/:id, /passport, /directory, /compare, /family, /ask/:id?,
  /admin, /about`
- Engine statuses: `likely | potential | insufficient | not-matching`; radar:
  `strong | possible | needs-info | not-matching`; `manual-verify` rules always unknown
- Data: `src/data/schemes/central.ts` (19) + `central-more.ts` (30, total 49 central) +
  `states.ts` (16), `src/data/questions.ts`, `src/data/documents.ts`;
  all en + te strings live in `src/i18n/en.ts` / `te.ts`; hi/ta/bn/mr/gu/kn/ml/pa/or
  are core-subset dicts that fall back to en per key (`I18nProvider` `?? en[key]`);
  keep the storage prefix `sahayak:` (old data continuity) even though the brand is Sahara
- Storage prefix `sahayak:` via `src/services/storage.ts`; AI key only server-side
  (`api/explain.ts`, `AI_API_KEY`); admin token via `VITE_ADMIN_TOKEN` (min 8 chars)
- Node test files import `*.ts` paths explicitly (`allowImportingTsExtensions`); `rg`
  unavailable on this machine — use grep tool or `Select-String`

## Honesty rules (do not break)
- No fabricated schemes/URLs/amounts/deadlines; keep verification statuses truthful
- Never claim government affiliation or approvals; footer/about disclaimers stay
- Vite `base` must match the GitHub Pages project name (`'/sahara/'`); `VERCEL=1` switches to `/`

## Git + GitHub (set up — do NOT re-authenticate)
- Repo: `https://github.com/leelavardhan2123-svc/sahara` (public, branch `main`)
- Plain `git add/commit/push` works (credentials in Windows Credential Manager);
  gh CLI at `%LOCALAPPDATA%\Programs\gh\bin\gh.exe`, logged in as `leelavardhan2123-svc`
- Push to `main` → GitHub Actions deploys Pages → https://leelavardhan2123-svc.github.io/sahara/
- **Do not push or modify GitHub until the user explicitly says so**
