# Spec

## Calculation

| Step | Formula |
|---|---|
| BMR (Mifflin-St Jeor) | `10*kg + 6.25*cm - 5*age + (5 male / -161 female)` |
| TDEE | `BMR * activityMultiplier` |
| Target kcal | `TDEE * (1 + goalDelta)` |
| Protein | `proteinPerKg * weightKg`, kcal = `g * 4` |
| Fat | `fatPct * targetKcal / 9` |
| Carbs | residual: `(targetKcal - proteinKcal - fatKcal) / 4`, clamped ≥ 0 |

### Constants

```
ACTIVITY_MULTIPLIERS:
  sedentary 1.2, light 1.375, moderate 1.55, very 1.725, extra 1.9

GOAL_DELTAS:
  cut -0.20, maintain 0, bulk +0.15

DIET_PRESETS (proteinPerKg, fatPct):
  balanced       1.6  0.30
  high-protein   2.2  0.25
  low-carb       1.8  0.50
  keto           1.8  0.70

KCAL_PER_G: protein 4, carbs 4, fat 9

BOUNDS:
  age 14..100, weightKg 30..300, heightCm 100..250
```

### Unit conversions

- `lbToKg(lb) = lb * 0.45359237`
- `ftInToCm(ft, in) = (ft * 12 + in) * 2.54`

## Wizard UX

5 linear steps with step indicator at top, Back/Next at bottom.

| # | Step | Inputs |
|---|---|---|
| 1 | Personal | unit toggle, sex, age, weight, height |
| 2 | Activity | one of 5 presets (radio-group) |
| 3 | Goal | cut / maintain / bulk (radio-group) |
| 4 | Macros | diet preset (radio-group) + protein g/kg slider + fat % slider; carbs auto |
| 5 | Results | kcal, grams, % per macro, donut chart, edit/copy-link buttons |

### URL contract

```
/?step=1..5
 &unit=metric|imperial
 &sex=male|female
 &age=N
 &weightKg=N       (canonical, even if user typed lb)
 &heightCm=N       (canonical, even if user typed ft+in)
 &activity=sedentary|light|moderate|very|extra
 &goal=cut|maintain|bulk
 &preset=balanced|high-protein|low-carb|keto|custom
 &proteinPerKg=N
 &fatPct=N         (0..1)
```

- Always store canonical metric internally. Imperial inputs convert on blur/debounce.
- `replace: true` on every sync to avoid history pollution.

### Bounds and warnings

- Hard block: outside `BOUNDS`.
- Warnings (non-blocking):
  - Very low/high BMI (BMI < 17 or > 40)
  - Cut goal selected with low body weight (e.g. weightKg < 50 with cut)
  - Macros infeasible: `proteinKcal + fatKcal > targetKcal` → carbs clamped to 0, surface a warning.

## File layout

```
src/
  components/
    wizard/                       generic shell
      wizard.tsx
      step.tsx
      step-indicator.tsx
      use-wizard.ts
      index.ts
      wizard.stories.tsx
      step-indicator.stories.tsx
  features/
    calculator/
      schema.ts                   zod schema (+ per-step picks)
      formulas.ts                 pure functions
      formulas.test.ts
      calculator.tsx              composes <Wizard> + steps
      calculator.test.tsx         one happy-path RTL
      steps/
        personal-step.tsx
        activity-step.tsx
        goal-step.tsx
        macros-step.tsx
        results-step.tsx
      results/
        macro-donut.tsx
        macro-donut.stories.tsx
  routes/
    index.tsx                     validateSearch + <Calculator />
```

## Tech notes

- **Form**: single TanStack Form instance, full Zod schema; per-step uses `schema.pick(...)`.
- **Routing**: `Route.validateSearch` mirrors schema for SSR-safe defaults.
- **Charts**: shadcn/charts (`pnpm dlx shadcn@latest add chart`) → Recharts donut.
- **Dark mode**: system preference + toggle, persisted in `localStorage` under `theme`.
- **A11y**: focus moves to step heading on advance; failed validation moves focus to first invalid field.
