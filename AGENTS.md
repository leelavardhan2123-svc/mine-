# AGENTS.md — Forever With You ❤️

Romantic gift website template (React + Vite). User: **leelavardhan**, beginner — explain steps simply.

## Commands
- `npm run dev` → http://localhost:5173
- `npm run lint` / `npm run build` / `npm run smoke` (smoke = 24-check Playwright test, needs dev server running)
- **All personalization lives in one file: `src/config/site.ts`** (names, date, colors, letter, gallery, music, final screen)

## Git + GitHub (fully set up — do NOT re-authenticate)
- Repo: `https://github.com/leelavardhan2123-svc/mine-` (public, branch `main`)
- Credentials persist in Windows Credential Manager (`git:https://github.com`) — plain `git add/commit/push` works with zero prompts
- gh CLI: `%LOCALAPPDATA%\Programs\gh\bin\gh.exe` (also on user PATH), logged in as `leelavardhan2123-svc`
- If `git`/`gh` not found in current shell: call full paths (`C:\Program Files\Git\cmd\git.exe`)

## Deployment (all automatic)
- Push to `main` → GitHub Actions (`.github/workflows/deploy.yml`) builds + publishes to **GitHub Pages**
- Live: https://leelavardhan2123-svc.github.io/mine-/
- **`vite.config.ts` has `base: '/mine-/'` — must stay or Pages asset paths break**
- Mirror (optional): Vercel `forever-zeta-mocha.vercel.app`
- User's phrase "push the update" = commit + push; live site redeploys itself

## Conventions
- TypeScript strict + `verbatimModuleSyntax` (use `import type`); lint via oxlint
- No comments in code unless asked; edits must pass `npm run lint && npm run build`
- Public/ asset URLs must go through `assetUrl()` from `src/lib/utils.ts` (base-path aware)
- **Do not push or modify GitHub until the user explicitly says so**
