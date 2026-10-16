# Sahara — Government Scheme Finder

**Every eligible citizen deserves to know.**

Sahara is a citizen-focused government scheme finder built for INNOHACKS 2.0. It
helps users discover potentially relevant government schemes based on their
personal and family details.

**Live Website:** https://leelavardhan2123-svc.github.io/sahara/

## Features

- **Scheme Matching:** Evaluates user details against predefined eligibility rules.
- **Explainable Results:** Shows matching conditions and missing information.
- **Document Checklist:** Tracks required application documents.
- **Scheme Passport:** Saves schemes and eligibility results.
- **Family Profiles:** Explores schemes for family members.
- **Voice Accessibility:** Supports speech input and speak-aloud features.
- **11 Indian Languages:** English, Telugu, Hindi, Tamil, Bengali, Marathi, Gujarati, Kannada, Malayalam, Punjabi, and Odia.
- **Offline-lite Support:** Caches parts of the application for offline access.

## How It Works

Sahara uses a rule-based eligibility engine to classify results as likely,
potential, insufficient, or not matching.

The catalogue contains **65 scheme records**:

- 49 Central Government schemes
- 8 Andhra Pradesh schemes
- 8 Telangana schemes

Results are preliminary guidance, not a guarantee of eligibility.

## Technology Stack

React 19, TypeScript 6, Vite 8, Tailwind CSS 4, Framer Motion, and Lucide React.
Browser Speech APIs support voice features. An optional `gpt-4o-mini` integration
uses a Vercel serverless function and requires separate deployment and
verification.

## Run Locally

Requires Node.js and npm.

```bash
npm install
npm run dev
```

Other commands: `npm run build`, `npm run lint`, `npm run test:engine`,
`npm run preview`, and `npm run smoke`.

## Privacy and Deployment

Application data is stored locally using browser `localStorage`. The frontend is
hosted on GitHub Pages; the optional AI endpoint is intended for Vercel
deployment.

**Disclaimer:** Sahara is an independent project, not a government body. It does
not accept applications or approve benefits. Users should verify scheme details
through official government portals.
