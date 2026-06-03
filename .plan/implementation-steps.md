# Implementation Steps

Each step is mergeable on its own. Tick as we go.

## 1. Pure formulas + tests — current

- [ ] `src/features/calculator/formulas.ts`
  - Constants: `ACTIVITY_MULTIPLIERS`, `GOAL_DELTAS`, `DIET_PRESETS`, `KCAL_PER_G`, `BOUNDS`
  - Types: `Sex`, `ActivityLevel`, `Goal`, `DietPreset`, `MacroSplit`
  - Functions: `bmr`, `tdee`, `kcalForGoal`, `splitMacros`, `lbToKg`, `kgToLb`, `ftInToCm`, `cmToFtIn`
- [ ] `src/features/calculator/formulas.test.ts`
  - BMR male/female (known reference values)
  - TDEE per activity level
  - kcalForGoal per goal
  - splitMacros: balanced, high-protein, low-carb, keto; feasible + infeasible
  - Conversions: round-trip kg↔lb, cm↔ft/in
  - Bounds constants sanity

## 2. Zod schema + per-step picks

- [ ] `src/features/calculator/schema.ts`
- [ ] Re-use bounds from `formulas.ts`

## 3. Generic wizard primitives

- [ ] `src/components/wizard/wizard.tsx`
- [ ] `src/components/wizard/step.tsx`
- [ ] `src/components/wizard/step-indicator.tsx`
- [ ] `src/components/wizard/use-wizard.ts`
- [ ] `src/components/wizard/index.ts`
- [ ] Storybook: `wizard.stories.tsx`, `step-indicator.stories.tsx`

## 4. Shadcn additions

- [ ] `pnpm dlx shadcn@latest add chart` (Recharts wrapper)
- [ ] Confirm `radio-group` primitive is in `src/components/ui/` (already storybook-wrapped)

## 5. Calculator steps

- [ ] `steps/personal-step.tsx` — unit toggle, sex, age, weight, height (with ft+in branch)
- [ ] `steps/activity-step.tsx` — 5-preset radio
- [ ] `steps/goal-step.tsx` — 3-preset radio
- [ ] `steps/macros-step.tsx` — diet preset radio + protein/fat sliders, live carb readout
- [ ] `steps/results-step.tsx` — numbers, donut, edit/copy-link actions

## 6. Donut chart

- [ ] `results/macro-donut.tsx`
- [ ] `results/macro-donut.stories.tsx`

## 7. Calculator composition

- [ ] `calculator.tsx` — single TanStack Form, wires steps, focus management
- [ ] Dark-mode toggle in header (root layout)

## 8. Route integration

- [ ] `routes/index.tsx` — `validateSearch`, debounced search sync, hydrate form
- [ ] Replace placeholder `Welcome to TanStack Start` content

## 9. Integration test

- [ ] `calculator.test.tsx` — fill all 5 steps, assert results numbers
- [ ] Add jsdom config to vitest (or `vitest.config.ts`)
