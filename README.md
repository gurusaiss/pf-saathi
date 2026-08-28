# PF Saathi

**Understand your PF. Find what's wrong. Know what to do next.**

A citizen-first layer over India's EPFO (Employees' Provident Fund Organisation) — built for **Build for Bharat Moves India**.

> Built for the hackathon — runs on realistic simulated data, not connected to live EPFO systems.

---

## The problem

EPFO manages retirement savings for over 6 crore Indian workers, but the member experience is opaque:

- Claims get **rejected silently** — a name mismatch, an unlinked Aadhaar, a dead bank IFSC — and members find out weeks later with no clear next step.
- PF balances get **stranded** across old accounts from previous jobs, sitting unclaimed instead of merged into one.
- Employers **skip contributions** in some months while still deducting them from payslips, and members have no visibility into the gap.
- Families **lose access to insurance and pension** after a member's death because no e-Nomination was ever filed.

PF Saathi turns each of these into something a member can see coming, understand, and fix — before it becomes a rejection.

## What it does

| Feature | What it solves |
|---|---|
| **Preflight Claim Check** | Runs a claim against 8 rejection rules *before* submission, shows a live score, and lets you fix each issue (name mismatch, KYC, bank details, nomination, etc.) with one click |
| **Dashboard health score** | A single glanceable score across all 10 profile checks — not just claim-blockers, but everything that affects your PF health |
| **Stranded balance tracker** | Finds old PF accounts from previous employers and walks you through transferring them into one |
| **Withdrawal advisor** | Models TDS impact, EPS pension eligibility, and the future value lost by withdrawing early — before you decide |
| **Contribution timeline** | Flags months where your payslip shows a PF deduction but EPFO's record doesn't, with a direct link to file a grievance |
| **Grievance tracker** | Turns "file a complaint" into a trackable 4-step status (submitted → acknowledged → forwarded → resolved) |
| **Family & nomination** | Explains EDLI insurance and EPS survivor pension in plain language, and guides e-Nomination filing |
| **Survivor guide** | A no-login-required guide for a family member handling a death claim, with the exact forms needed |
| **Ask PF Saathi** | A rules-grounded assistant that answers questions using your *actual* live profile state, not generic FAQs |
| **Accessibility** | Text scaling, high-contrast mode, read-aloud (Web Speech API), and Hindi/English toggle throughout |

## Why it's different

The rules engine (`lib/rules/rejectionRules.ts`) is the core of the product: **10 deterministic rejection rules** run against a member's profile, each carrying a reason, a consequence, and a specific fix route. Every page — dashboard, claims, preflight, the assistant — reads from the same live rule evaluation, so fixing an issue anywhere in the app updates every other page instantly. Nothing is hardcoded per screen.

Four realistic personas demonstrate the range of real EPFO failure modes: a member with stranded balances across job changes, one with active claim rejections, one with an employer contribution gap, and one with no nomination on file after 14+ years of service.

## Tech stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS v4** for styling, with CSS custom properties driving theming, text scale, and contrast mode
- Mock backend — all data is typed TypeScript, no database, so the whole app runs standalone
- React Context + `localStorage` for session state, so fixes persist across a reload without a backend
- Web Speech API for accessible read-aloud, no external service

## Running locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Log in with any of the demo UANs (shown on the login screen) to explore a persona — or use the judge tour overlay to walk through all four automatically.

```bash
npm run build   # production build
npm run lint    # eslint
```

## Project structure

```
app/                  routes (dashboard, claims, transfer, withdraw, grievance, family, survivor, learn, ask…)
components/pf/        product-specific components (Shell, ScoreRing, MoneyMap, tour overlay, a11y menu)
components/ui/        generic UI primitives (Button, Card, Badge, Toast, ReadAloud)
lib/rules/            the rejection-rules engine and profile adapter — the core IP
lib/mock/             persona data and types
lib/                  session state, overrides, i18n, tour, withdrawal math, live-state helpers
```

## Disclaimer

This is a hackathon prototype. All member data is simulated. PF Saathi is not affiliated with, endorsed by, or connected to the EPFO or the Government of India.
