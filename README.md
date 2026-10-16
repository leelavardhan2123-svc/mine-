# Sahara — Government Scheme Finder

**Every eligible citizen deserves to know.**

Sahara is a scheme discovery platform built for INNOHACKS 2.0. It helps people
find government schemes that may suit their personal and family circumstances.

**Live Website:** https://leelavardhan2123-svc.github.io/sahara/

## Features

- Eligibility matching with explainable results.
- Document checklist and saved schemes through Scheme Passport.
- Family profiles for exploring benefits.
- Voice input and speak-aloud support.
- 11 languages: English, Telugu, Hindi, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia.
- Offline-lite access through browser caching.

## How It Works

Sahara uses predefined eligibility rules to classify results as likely,
potential, insufficient, or not matching. The catalogue contains **65 records:
49 Central Government schemes, 8 Andhra Pradesh schemes, and 8 Telangana
schemes**. Results are preliminary guidance, not a guarantee of eligibility.

## Technology

React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Framer Motion, and Lucide React.
Browser Speech APIs power voice features. An optional `gpt-4o-mini` integration
uses a Vercel serverless function and must be deployed and verified separately.

## Run Locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Other commands: `npm run build`, `npm run lint`, `npm run test:engine`,
`npm run preview`, and `npm run smoke`.

## Privacy and Deployment

Data is stored locally in the browser using `localStorage`. The frontend is
hosted on GitHub Pages; the optional AI endpoint is intended for Vercel.

**Disclaimer:** Sahara is not a government body. It does not accept applications
or approve benefits. Verify scheme details through official government portals.
