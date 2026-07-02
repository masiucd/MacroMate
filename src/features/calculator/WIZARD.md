# Calculator Wizard — Page Spec

5-step form wizard. Schemas live in `src/features/calculator/schema.ts`. Formulas + bounds in `src/features/calculator/formulas.ts`. Steps 1–4 collect input, step 5 renders results (no input).

UI primitives available in `src/components/ui/`: `button`, `input`, `label`, `select`, `slider`, `switch`, `textarea`. Use `#/components/typography` for `<Heading>` / `<Text>`. Never write raw `<h1>`/`<p>`. Use Tailwind utility classes for colors — no `var(--token)` in JSX (see `CLAUDE.md`).

Form state: TanStack Form (`@tanstack/react-form`) — already imported in `index.tsx`. URL persistence: `searchSchema` in schema.ts — wire `Route.validateSearch = searchSchema.parse` and seed defaults from `searchToFormValues(search)`.

---

## Step 1 — Personal Details

Schema: `personalStepSchema`. Fields: `unit`, `sex`, `age`, `weightKg`, `heightCm`.

| Field      | Type                          | Control                 | Bounds / Values                                   |
| ---------- | ----------------------------- | ----------------------- | ------------------------------------------------- |
| `unit`     | `"metric" \| "imperial"`      | Switch or 2-button toggle | `UNITS`                                           |
| `sex`      | `"male" \| "female"`          | Radio group / segmented | `SEXES`                                           |
| `age`      | int                           | Number `input`          | 14–100 (`BOUNDS.ageMin/Max`)                      |
| `weightKg` | number (stored as kg)         | Number `input` + unit suffix | 30–300 kg                                    |
| `heightCm` | number (stored as cm)         | Single cm `input` OR ft+in pair when imperial | 100–250 cm |

What must exist on page:

- Heading "About you"
- Unit toggle (top of form — switching converts display only; store stays metric)
- Sex selector
- Age field
- Weight field — show "kg" or "lb" suffix per `unit`. Convert with `lbToKg` / `kgToLb` from `formulas.ts`.
- Height field — when `unit === "imperial"` render two inputs (ft + in), combine with `ftInToCm`; when metric, single cm input.
- Next button — disabled until `personalStepSchema.safeParse(values).success`.
- Inline error text per field on blur.

Code example — unit-aware weight field:

```tsx
import {Input} from "#/components/ui/input"
import {Label} from "#/components/ui/label"
import {kgToLb, lbToKg} from "#/features/calculator/formulas"

function WeightField({
	unit,
	valueKg,
	onChange,
}: {
	unit: "metric" | "imperial"
	valueKg: number | undefined
	onChange: (kg: number) => void
}) {
	const display = unit === "metric" ? valueKg : valueKg ? kgToLb(valueKg) : undefined
	const suffix = unit === "metric" ? "kg" : "lb"
	return (
		<div>
			<Label htmlFor="weight">Weight ({suffix})</Label>
			<Input
				id="weight"
				type="number"
				inputMode="decimal"
				value={display ?? ""}
				onChange={(e) => {
					const n = Number(e.target.value)
					if (Number.isNaN(n)) return
					onChange(unit === "metric" ? n : lbToKg(n))
				}}
			/>
		</div>
	)
}
```

---

## Step 2 — Activity Level

Schema: `activityStepSchema`. Field: `activity`.

| Field      | Type             | Control                  | Values                                                  |
| ---------- | ---------------- | ------------------------ | ------------------------------------------------------- |
| `activity` | `ActivityLevel`  | Radio cards (one per level) | `sedentary` `light` `moderate` `very` `extra`        |

What must exist:

- Heading "How active are you?"
- 5 selectable cards, each showing label + short description + the TDEE multiplier (from `ACTIVITY_MULTIPLIERS` — sedentary 1.2 → extra 1.9).
- Back + Next buttons.
- Helper copy explaining "active = workouts, not just step count".

Code example — radio card group:

```tsx
import {ACTIVITY_MULTIPLIERS} from "#/features/calculator/formulas"
import {ACTIVITY_LEVELS} from "#/features/calculator/schema"

const ACTIVITY_LABELS: Record<(typeof ACTIVITY_LEVELS)[number], string> = {
	sedentary: "Sedentary — desk job, little exercise",
	light: "Light — 1–3 workouts / week",
	moderate: "Moderate — 3–5 workouts / week",
	very: "Very active — 6–7 workouts / week",
	extra: "Extra — physical job + daily training",
}

function ActivityPicker({
	value,
	onChange,
}: {
	value: string | undefined
	onChange: (v: (typeof ACTIVITY_LEVELS)[number]) => void
}) {
	return (
		<div className="grid gap-2">
			{ACTIVITY_LEVELS.map((level) => (
				<label
					key={level}
					className={`flex cursor-pointer items-center justify-between rounded-lg border p-3 ${
						value === level ? "border-lagoon bg-lagoon/10" : "border-line"
					}`}
				>
					<span>{ACTIVITY_LABELS[level]}</span>
					<span className="text-sm tabular-nums">×{ACTIVITY_MULTIPLIERS[level]}</span>
					<input
						type="radio"
						name="activity"
						value={level}
						checked={value === level}
						onChange={() => onChange(level)}
						className="sr-only"
					/>
				</label>
			))}
		</div>
	)
}
```

---

## Step 3 — Goal

Schema: `goalStepSchema`. Field: `goal`.

| Field  | Type                              | Control          | Values                          |
| ------ | --------------------------------- | ---------------- | ------------------------------- |
| `goal` | `"cut" \| "maintain" \| "bulk"`   | 3-card selector  | `GOALS`                         |

What must exist:

- Heading "What's your goal?"
- 3 cards showing label + kcal delta from `GOAL_DELTAS` (cut −20 %, maintain 0, bulk +15 %).
- Live preview line: "Your target ≈ N kcal/day" — compute on the fly via `bmr → tdee → kcalForGoal` using values from steps 1+2 (don't block if missing — hide preview).
- Back + Next buttons.

Code example — live kcal preview:

```tsx
import {bmr, kcalForGoal, tdee} from "#/features/calculator/formulas"

function GoalPreview({values}: {values: Partial<FormValues>}) {
	const ready =
		values.sex && values.age && values.weightKg && values.heightCm && values.activity && values.goal
	if (!ready) return null
	const b = bmr({
		sex: values.sex,
		age: values.age,
		weightKg: values.weightKg,
		heightCm: values.heightCm,
	})
	const target = kcalForGoal(tdee(b, values.activity), values.goal)
	return <Text>Target ≈ {Math.round(target)} kcal/day</Text>
}
```

---

## Step 4 — Macros

Schema: `macrosStepSchema`. Fields: `preset`, `proteinPerKg`, `fatPct`.

| Field          | Type                      | Control                  | Bounds / Values                                |
| -------------- | ------------------------- | ------------------------ | ---------------------------------------------- |
| `preset`       | `DietPreset \| "custom"`  | `Select` or chip group   | `DIET_PRESET_VALUES`                           |
| `proteinPerKg` | number (g per kg BW)      | `Slider` + numeric label | 0.5–4 (`PROTEIN_PER_KG_BOUNDS`)                |
| `fatPct`       | number (0–1)              | `Slider` + % label       | 0.10–0.85 (`FAT_PCT_BOUNDS`)                   |

Behavior:

- Selecting a non-`custom` preset writes that preset's `proteinPerKg` + `fatPct` into the form (from `DIET_PRESETS`) and locks the sliders (read-only).
- Selecting `custom` unlocks both sliders.
- Editing a slider while a preset is active flips `preset` to `"custom"` automatically.
- Show carb % derived live: `carbsPct = 1 − proteinPct − fatPct` where `proteinPct = (proteinPerKg × weightKg × 4) / targetKcal`. If `< 0` → show warning "Targets infeasible — reduce protein or fat" (matches `splitMacros().isFeasible === false`).

What must exist:

- Heading "Macros"
- Preset selector with 5 options
- Protein slider (g/kg) + computed total grams
- Fat slider (%)
- Live macro breakdown card (P/C/F grams + kcal) using `splitMacros()`
- Feasibility warning when applicable
- Back + Submit/Next button

Code example — preset → slider sync:

```tsx
import {DIET_PRESETS} from "#/features/calculator/formulas"
import {DIET_PRESET_VALUES} from "#/features/calculator/schema"

function applyPreset(preset: (typeof DIET_PRESET_VALUES)[number]) {
	if (preset === "custom") return null
	return DIET_PRESETS[preset]
}

// in component:
// onPresetChange(p) -> setValues({preset: p, ...(applyPreset(p) ?? {})})
// onSliderChange()  -> setValues({preset: "custom", proteinPerKg | fatPct})
```

---

## Step 5 — Results

No schema (no user input). Inputs: complete `FormValues` from steps 1–4.

What must exist:

- Heading "Your plan"
- Summary card:
  - BMR (`bmr(...)`)
  - TDEE (`tdee(bmr, activity)`)
  - Target kcal (`kcalForGoal(tdee, goal)`)
- Macro breakdown (from `splitMacros(...)`): protein g, carbs g, fat g, % share each.
- Feasibility banner if `isFeasible === false`.
- Action row: "Start over" (resets form + clears search params), "Edit inputs" (navigate to step 1), share/copy URL button (URL already encodes state via `searchSchema`).

Code example — assembling results:

```tsx
import {bmr, kcalForGoal, splitMacros, tdee} from "#/features/calculator/formulas"
import type {FormValues} from "#/features/calculator/schema"

function computeResults(v: FormValues) {
	const b = bmr({sex: v.sex, age: v.age, weightKg: v.weightKg, heightCm: v.heightCm})
	const t = tdee(b, v.activity)
	const kcal = kcalForGoal(t, v.goal)
	const macros = splitMacros({
		kcal,
		weightKg: v.weightKg,
		proteinPerKg: v.proteinPerKg,
		fatPct: v.fatPct,
	})
	return {bmr: b, tdee: t, kcal, macros}
}
```

---

## Shared shell (all steps)

- Progress indicator: "Step N of 5" + dot/bar showing position.
- Back button hidden on step 1; Next becomes "See results" on step 4.
- Per-step guard: on Next click, run `validateStep(currentStep, values)`; only advance on `ok: true`.
- Reflect `step` + all entered fields into the URL via `Route.useNavigate({search: ...})` so the wizard is shareable + reloadable.
- Wrap each step body in `<PageWrapper>` (already imported in `index.tsx`).

Skeleton:

```tsx
import {validateStep, type Step} from "#/features/calculator/schema"

function next(currentStep: Step, values: Partial<FormValues>) {
	if (currentStep === 5) return
	const res = validateStep(currentStep as 1 | 2 | 3 | 4, values)
	if (!res.ok) return // surface res.issues to fields
	// navigate({search: (prev) => ({...prev, step: currentStep + 1})})
}
```

---

## Suggested file layout

```
src/routes/calculator/
  index.tsx              # route shell, owns form + URL sync, switches on step
  -components/
    StepPersonal.tsx
    StepActivity.tsx
    StepGoal.tsx
    StepMacros.tsx
    StepResults.tsx
    WizardNav.tsx        # Back / Next + progress
```

TanStack Router treats `-`-prefixed dirs as non-route. Keep step components colocated under `-components/` so they don't pollute the route tree.
