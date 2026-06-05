# Implementation Steps

Each step is mergeable on its own. Tick as we go.

## 1. Pure formulas + tests — done

- [x] `src/features/calculator/formulas.ts`
  - Constants: `ACTIVITY_MULTIPLIERS`, `GOAL_DELTAS`, `DIET_PRESETS`, `KCAL_PER_G`, `BOUNDS`
  - Types: `Sex`, `ActivityLevel`, `Goal`, `DietPreset`, `MacroSplit`
  - Functions: `bmr`, `tdee`, `kcalForGoal`, `splitMacros`, `lbToKg`, `kgToLb`, `ftInToCm`, `cmToFtIn`
- [x] `src/features/calculator/formulas.test.ts` — 28 tests

## 2. Zod schema + per-step picks — done

- [x] `src/features/calculator/schema.ts`
  - Constants: `UNITS`, `SEXES`, `ACTIVITY_LEVELS`, `GOALS`, `DIET_PRESET_VALUES`, `STEP_COUNT`, `STEPS`, `PROTEIN_PER_KG_BOUNDS`, `FAT_PCT_BOUNDS`
  - Schemas: `formSchema`, `personalStepSchema`, `activityStepSchema`, `goalStepSchema`, `macrosStepSchema`, `stepSchemas` map, `searchSchema` (coerced + `.catch({})`)
  - Helpers: `validateStep`, `searchToFormValues`
  - Types: `FormValues`, `SearchValues`, `Unit`, `Step`, `StepWithValidation`
- [x] `src/features/calculator/schema.test.ts` — 30 tests
- [x] Re-uses `BOUNDS` from `formulas.ts`

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
