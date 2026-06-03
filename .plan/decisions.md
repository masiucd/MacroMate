# Decisions

Captured from grill-me session, 2026-06-03.

## Scope

- **Q1 — Core goal**: TDEE + macro split only. No food/recipe tracking, no persistence beyond URL.

## Calculation

- **Q2 — BMR formula**: Mifflin-St Jeor. `BMR = 10*kg + 6.25*cm - 5*age + (5 male / -161 female)`.
- **Q3 — Activity multiplier**: 5 presets (Sedentary 1.2, Light 1.375, Moderate 1.55, Very 1.725, Extra 1.9).
- **Q4 — Goal adjustment**: 3 presets (cut −20%, maintain 0, bulk +15%).
- **Q5 — Macro split**: tunable sliders + diet preset suggestions.
- **Q6 — Diet presets**: Balanced, High-protein, Low-carb, Keto. Carbs = residual. Protein in g/kg bodyweight.

## Inputs / Units

- **Q7 — Units**: metric/imperial toggle. Sex: binary (Mifflin requirement).
- **Q10 — Bounds**: age 14–100, weight 30–300 kg, height 100–250 cm. Hard block outside; soft warnings near edges.

## UX

- **Q8 — Form layout**: multi-step wizard, 5 steps (Personal → Activity → Goal → Macros → Results).
- **Q8 — Results display**: numbers + donut/bar chart.
- **Q8 — Imperial height**: two fields (ft + in).
- **Q9 — Chart**: shadcn/charts (Recharts wrapper).
- **Q9 — Wizard nav**: linear next/back + step indicator.
- **Q11 — URL**: single route `/?step=N&...fields`.
- **Q11 — Sync**: debounced (~300 ms) on every change, `replace: true`.
- **Q12 — SSR**: Route `validateSearch` seeds form `defaultValues`. No hydration mismatch.
- **Q12 — Empty state**: step 1, empty fields.
- **Q16 — Results actions**: edit (jump back) + copy link.
- **Q16 — Focus a11y**: focus step heading on advance, Enter advances.
- **Q16 — Dark mode**: system default + user toggle, persisted in localStorage.
- **Q17 — Indicator jump**: click completed steps only, no skip-forward. After results, all clickable.

## Tech

- **Q9 — Form state**: single TanStack Form instance, multi-step UI.
- **Q10 — Validation**: one Zod schema; per-step subsets via `.pick()`.
- **Q13 — Wizard files**: `src/components/wizard/` for generic shell.
- **Q13 — Feature files**: `src/features/calculator/` for schema, formulas, steps, results.
- **Q14 — Wizard scope**: generic shell (`<Wizard>`, `<Step>`, `useWizard()`); calculator steps as siblings under `features/calculator/`.
- **Q14 — Formulas path**: `src/features/calculator/formulas.ts`.

## Testing

- **Q15 — Test scope**: formulas unit tests (exhaustive) + one wizard happy-path RTL.
- **Q15 — Storybook**: wizard shell + step indicator + chart only.
