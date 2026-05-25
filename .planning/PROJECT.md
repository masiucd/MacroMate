# Macro Calculator

## What This Is

A mobile-first web app that calculates daily macro targets (protein, carbs, fat) based on user stats and fitness goals. Users enter their age, weight, height, and activity level, pick a goal (lose fat, maintain, build muscle, or improve strength/performance), and receive their personalized macro breakdown — no account required.

## Core Value

A user gets their daily macro targets in under a minute with zero friction — no signup, no bloat, just enter stats and get numbers.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] User can enter stats: age, weight, height, sex, activity level
- [ ] User can select one of 4 goals: lose fat, maintain, build muscle, strength/performance
- [ ] App calculates and displays daily macro targets (protein, carbs, fat in grams)
- [ ] Multi-step wizard flow: stats → goal → results
- [ ] Mobile-first responsive design
- [ ] No account or login required — stateless

### Out of Scope

- User accounts / history — keeping it stateless for simplicity
- Meal suggestions or full meal plans — just macro targets for v1
- Native mobile app — mobile-first web covers the need without the overhead
- Body fat % / body composition inputs — standard stats are sufficient for v1

## Context

- Greenfield project, no existing code
- Target platform: mobile-first web app (works on any browser, optimized for mobile)
- Audience: self and general public interested in fitness nutrition
- No backend needed — pure client-side calculation

## Constraints

- **Tech Stack**: Client-side only — no backend, no database
- **Scope**: No authentication, no data persistence beyond the session

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| 4 fitness goals (lose fat, maintain, build muscle, strength) | Matches how users actually think about their goals | — Pending |
| Stateless — no accounts | Reduces friction dramatically; users just want numbers | — Pending |
| Multi-step wizard | Clearer UX than dumping all fields on one screen | — Pending |
| Mobile-first web | No install friction, works everywhere | — Pending |

---
*Last updated: 2025-05-25 after initialization*
