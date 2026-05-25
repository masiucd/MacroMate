# Research Summary: Macro Calculator Web App

## Recommended Stack

**React 18 + Vite + TypeScript + Tailwind CSS**

- React with `useReducer` for wizard state — no external state library needed
- Vite for fast builds and zero-config static deployment
- TypeScript to catch unit conversion bugs at compile time
- Tailwind for mobile-first styling
- React Hook Form for form validation
- Vitest for testing calculation functions

Deploy as static site to Vercel or Netlify.

## Table Stakes Features

1. Stats input: age, sex, weight, height, activity level, units (metric/imperial)
2. Goal selection: lose fat / maintain / build muscle / strength & performance
3. Results: daily calories + protein/carbs/fat in grams
4. Unit toggle: metric ↔ imperial
5. Input validation with reasonable ranges
6. Clear activity level descriptions (users over-estimate activity)

## Architecture Pattern

Multi-step wizard (3 steps) over a pure calculation library:

```
Step 1: Stats → Step 2: Goal → Step 3: Results
                   ↓
         Pure calculation lib (bmr.ts, tdee.ts, macros.ts, units.ts)
```

Store all values in metric internally. Convert only for display.

## Watch Out For

1. **Wrong BMR formula** — Use Mifflin-St Jeor, not Harris-Benedict
2. **Unit conversion bugs** — Store in metric internally, type aliases in TypeScript
3. **Calorie floor** — Apply 1200 kcal (women) / 1500 kcal (men) minimums
4. **Protein targets too low** — Use sport nutrition targets (1.6-2.4g/kg), not RDA
5. **Mobile input keyboard** — Use `inputmode="numeric"` on all number fields
6. **Activity level descriptions** — Write concrete labels, not vague "very active"

## Out of Scope Confirmed

Food logging, meal plans, accounts, social features, AI recommendations — all anti-features for this product.

---
*Synthesized: 2025-05-25*
