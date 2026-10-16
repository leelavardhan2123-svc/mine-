# Sahara — Government Scheme Finder

**Every eligible citizen deserves to know.**

Sahara is a citizen-focused government scheme finder built for INNOHACKS 2.0. It
helps users discover potentially relevant government schemes based on their
personal details, with voice interaction and support for 11 Indian languages.

**Live website:** https://leelavardhan2123-svc.github.io/sahara/

## Features

- **Scheme matching:** Matches user information against structured eligibility rules.
- **Explainable results:** Shows matching conditions, missing information, and official source links.
- **Document checklist:** Track documents needed for applications.
- **Scheme passport:** Save schemes and eligibility results.
- **Family profiles:** Explore schemes for different family members.
- **Voice accessibility:** Speech input and speak-aloud features.
- **11 languages:** English, Telugu, Hindi, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia.
- **Offline-lite support:** Caches parts of the application for offline use.

## How it works

Sahara uses a deterministic eligibility engine to evaluate predefined scheme
rules. It classifies results as likely, potential, insufficient, or not matching
based on the user's answers.

The catalogue contains **65 scheme records**:

- 49 Central Government schemes
- 8 Andhra Pradesh schemes
- 8 Telangana schemes

Records include eligibility rules, benefits, required documents, official URLs,
and verification status.

A scheme match is only a preliminary assessment. Final eligibility is determined
by the relevant government department.

## Technology stack

**React 19 · TypeScript 6 · Vite 8 · Tailwind CSS 4 · Framer Motion · Lucide React**

Browser Speech APIs handle voice input and speak-aloud. The project also includes
an optional `gpt-4o-mini` integration through a Vercel serverless function.

> **Note:** The remote AI endpoint must be deployed and verified separately from
> the GitHub Pages frontend. The core eligibility engine works independently of
> the AI service.

## Run locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL displayed by Vite, usually `http://localhost:5173`.

| Command | Purpose |
| ------- | ------- |
| `npm run build` | Type-check and build |
| `npm run lint` | Check code quality |
| `npm run test:engine` | Run eligibility tests |
| `npm run preview` | Preview the production build |
| `npm run smoke` | Run browser smoke tests |

## Project structure

```
api/       Optional AI endpoint
public/    Service worker
scripts/   Browser smoke tests
tests/     Eligibility-engine tests
src/
  app/     Routing and layout
  data/    Schemes and questionnaires
  engine/  Eligibility rules
  i18n/    Language support
  pages/   Application pages
  services/ Storage, AI and speech
```

## Privacy and limitations

Application data is stored locally in the browser using `localStorage`. The
current prototype does not use user accounts or a remote application database.

Scheme information may require updates, voice support varies by browser, and
some translations use English fallback text. The remote AI integration must be
verified before being presented as operational.

Sahara is not a government body. It does not accept applications or approve
benefits. Users should verify scheme details through the linked official
government portals before applying.

## Deployment

The frontend is deployed through GitHub Pages. The optional AI endpoint is
intended to run on Vercel with `AI_API_KEY` configured as a server-side
environment variable.
