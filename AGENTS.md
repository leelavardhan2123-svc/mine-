# AGENTS.md — Sahayak (INNOHACKS 2.0)

Citizen-facing Indian government scheme discovery app: guided questionnaire →
deterministic eligibility engine → explainable receipts, scheme passport,
document readiness, Telugu-first i18n, AI explainer, family benefit map,
offline-lite, admin overlay. User: **leelavardhan**, beginner — explain simply.

## Commands
- `npm run dev` → http://localhost:5173
- `npm run lint` / `npm run build` / `npm run test:engine` (16 Node unit tests)
- `npm run preview` (port 4173) then `npm run smoke` (27-check Playwright/Edge test, `SMOKE_URL` override)
- Edits must pass `npm run lint && npm run build && npm run test:engine`

## Project facts
- React 19 + TS 6 (strict, `verbatimModuleSyntax`, `import type`) + Vite 8 + Tailwind 4 + oxlint
- Hash routing (`useHashRoute`): `/, /discover, /results, /scheme/:id, /receipt/:id,
  /documents/:id, /passport, /directory, /compare, /family, /ask/:id?, /admin, /about`
- Engine statuses: `likely | potential | insufficient | not-matching`; radar:
  `strong | possible | needs-info | not-matching`; `manual-verify` rules always unknown
- Data: `src/data/schemes/central.ts` (19) + `states.ts` (16), `src/data/questions.ts`,
  `src/data/documents.ts`; all en + te strings live in `src/i18n/en.ts` / `te.ts`
- Storage prefix `sahayak:` via `src/services/storage.ts`; AI key only server-side
  (`api/explain.ts`, `AI_API_KEY`); admin token via `VITE_ADMIN_TOKEN` (min 8 chars)
- Node test files import `*.ts` paths explicitly (`allowImportingTsExtensions`); `rg`
  unavailable on this machine — use grep tool or `Select-String`

## Honesty rules (do not break)
- No fabricated schemes/URLs/amounts/deadlines; keep verification statuses truthful
- Never claim government affiliation or approvals; footer/about disclaimers stay
- Vite `base` must stay `'/mine-/'` for GitHub Pages; `VERCEL=1` switches to `/`

## Git + GitHub (set up — do NOT re-authenticate)
- Repo: `https://github.com/leelavardhan2123-svc/mine-` (public, branch `main`)
- Plain `git add/commit/push` works (credentials in Windows Credential Manager);
  gh CLI at `%LOCALAPPDATA%\Programs\gh\bin\gh.exe`, logged in as `leelavardhan2123-svc`
- Push to `main` → GitHub Actions deploys Pages → https://leelavardhan2123-svc.github.io/mine-/
- **Do not push or modify GitHub until the user explicitly says so**
