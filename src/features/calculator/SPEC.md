# Calculator Wizard — Implementation Spec

Prose companion to `WIZARD.md`. Where `WIZARD.md` lists the fields, bounds, and code snippets, this document describes *how the experience should behave* — UX flow, state model, logic wiring, and accessibility. Use it as the checklist when implementing the wizard.

Domain source of truth: `src/features/calculator/formulas.ts` (BMR, TDEE, macro split, unit conversion) and `src/features/calculator/schema.ts` (Zod schemas, step constants, URL search-param schema, `validateStep` helper). The wizard is a thin shell over those modules — no domain logic should live inside the route file.

---

## 1. Product intent

The wizard turns a handful of personal inputs into a daily calorie target and macro breakdown. It is **deliberately short, linear, and resumable**. Five steps:

1. Personal details (unit, sex, age, weight, height)
2. Activity level
3. Caloric goal (cut / maintain / bulk)
4. Macro distribution (preset or custom)
5. Results (read-only)

The user should feel that *each step is one decision*. We never present more than one concept per step; the only step with multiple fields is step 1, and there every field is a static fact the user already knows. The goal is to finish the flow in under a minute on the first try.

Steps 1–4 collect input and write to URL search params. Step 5 reads the full validated form, runs the formulas, and renders results. The URL is the canonical state — a refresh, a back/forward, or a shared link must restore the exact same view.

---

## 2. Information architecture

### 2.1 Shared shell

Every step renders inside the same shell. The shell is responsible for everything that is not the step body:

- **Header**: page heading "Calculator" plus a one-line subtitle that changes per step (e.g. step 1 says "Tell us about you", step 4 says "Pick your macros"). The subtitle is the user-facing step name; the numeric step indicator below is secondary.
- **Progress indicator**: "Step N of 5" label paired with a horizontal track of five segments. Completed segments are filled, the current segment is highlighted, future segments are dim. Each segment is a button — clicking a previously completed segment jumps back to that step; future segments are non-interactive until reached legitimately. (See §5.2 on what "completed" means.)
- **Step body**: the per-step content. Animated on enter/exit (see §3.3).
- **Nav row**: Back button on the left, primary action on the right. Back is hidden on step 1. The primary action is labelled "Next" on steps 1–3, "See results" on step 4, and "Start over" on step 5 (paired with a secondary "Edit inputs" link — see §4.5).
- **Footer hint** (optional, low priority): small print such as "Formulas use Mifflin-St Jeor." This is reference material, not interactive.

The shell does *not* own a heading hierarchy beyond the page title — the step body owns its own `<Heading>` so screen readers announce a logical document outline.

### 2.2 Layout grid

The form is centred in a single column, max width roughly 32rem (matches `PageWrapper` conventions). On viewports below ~640 px the form fills the width with comfortable horizontal padding; the nav row stacks vertically (Back stacked under primary) when there is not enough room for both buttons side by side.

Per-step bodies use vertical stacking. Step 1 is the only one that may use a two-column layout on wide viewports (unit toggle + sex selector on one row, then the three numeric inputs stacked) — every other step is single-column because the controls are large radio cards or sliders that read better full-width.

---

## 3. Step-by-step UX

### 3.1 Step 1 — Personal details

Heading "Tell us about you" or similar.

Order of controls top to bottom:

1. **Unit toggle** ("Metric" / "Imperial"). Default `metric`. This is rendered first because it changes the suffix and inputs underneath; once chosen it usually stays for the session.
2. **Sex** ("Female" / "Male"). Segmented selector or radio group with two visible options. Default `female` (matches current code). Use the project radio primitive — keep the labels large enough to tap on mobile.
3. **Age** (integer). Numeric input. Placeholder "e.g. 32". No spinners on mobile (use `inputMode="numeric"`).
4. **Weight**. Numeric input with a static suffix showing "kg" or "lb" depending on the unit toggle. Internally always stored in kg (see §4.4).
5. **Height**. When metric, a single "cm" input. When imperial, two inputs side by side labelled "ft" and "in". Internally always stored in cm.

Errors appear under each field on blur. The Next button is enabled only when `personalStepSchema.safeParse` would succeed against current values. If the user clicks Next while disabled (some users tab past validation), focus the first invalid field and announce the error via `aria-live="polite"`.

Microcopy: keep it functional, not chirpy. "Weight" not "How much do you weigh?". "Age" not "What's your age?".

### 3.2 Step 2 — Activity level

Heading "How active are you?" with a one-line helper: "Pick the level that matches your training, not just step count."

Five large cards, one per `ActivityLevel`. Each card shows:

- The label (e.g. "Moderate").
- A short qualifier ("3–5 workouts / week").
- The TDEE multiplier from `ACTIVITY_MULTIPLIERS` in small mono-spaced text (×1.55). Multiplier is useful for power users and reassures the curious; do not bury it but keep it secondary to the label.

Cards are radio inputs visually disguised as buttons. Selected state shows a border highlight plus a check icon. Only one selectable at a time. No default — Next is disabled until one is picked. Selecting a card does *not* auto-advance; the user must press Next so they have a chance to change their mind without back-tracking.

### 3.3 Step 3 — Goal

Heading "What's your goal?". Three cards: Cut, Maintain, Bulk. Each card shows the label, a one-line description ("Lose fat", "Hold weight", "Build muscle"), and the kcal delta from `GOAL_DELTAS` rendered as a percentage ("−20 %", "0 %", "+15 %").

**Live preview**: below the cards, when steps 1+2 have valid values, render a single line: "Daily target ≈ N kcal". Recompute on every change to `goal` *or* on entering this step. Round to the nearest 10 kcal — false precision (e.g. 2143 kcal) is misleading given the underlying formula error. Hide the preview when prerequisites are missing rather than showing "—" placeholders.

### 3.4 Transitions

Step changes animate horizontally: forward steps slide in from the right, back steps slide in from the left. Animation is short (~180 ms) and respects `prefers-reduced-motion` (skip animation when set). Focus moves to the new step's heading on entry so screen-reader users hear context immediately.

### 3.5 Step 4 — Macros

Heading "Pick your macros".

Top of step: a row of preset chips — Balanced, High-protein, Low-carb, Keto, Custom. Choosing a preset writes the corresponding `proteinPerKg` and `fatPct` from `DIET_PRESETS` into the form. The two sliders below reflect those values and are visually "locked" (greyed but still showing the value).

Below the chips, two sliders:

- **Protein per kg bodyweight** — range 0.5 to 4 g/kg, step 0.1. Show the raw value (e.g. "1.8 g/kg") and the absolute total ("≈ 144 g/day") computed from `weightKg`.
- **Fat % of calories** — range 10 % to 85 %, step 1 %. Show "30 % • 78 g/day" where the gram value is `fatPct × kcal / 9`.

Editing either slider while a non-custom preset is active automatically switches `preset` to `custom`. This is the most important interaction in this step — never silently keep the preset label while the values diverge from it.

Below the sliders, a **live breakdown card** shows three bars or rows, one per macro:

- Protein: grams, % of kcal, kcal subtotal
- Carbs: grams, % of kcal, kcal subtotal
- Fat: grams, % of kcal, kcal subtotal

Plus the total kcal. All values come from `splitMacros()`. When `isFeasible === false` (protein + fat already exceed target kcal), show a warning banner above the breakdown: "These targets don't fit your calorie goal. Lower protein or fat." Do not block the user from continuing — step 5 will show the same warning. The reason: we want the user to see the trade-off, not be trapped.

### 3.6 Step 5 — Results

Heading "Your plan". No nav-row Next button — only "Start over" and "Edit inputs" (plus a "Copy link" button, see §4.5).

Top card: the headline number — target kcal/day, large and centred. Sub-line: "BMR X · TDEE Y · Goal Z%".

Below that, the macro breakdown rendered as a horizontal stacked bar (protein / carbs / fat) with grams underneath each segment. Same data as step 4's live card but visually emphasised since this is the answer.

A small "How we got there" disclosure (collapsed by default) explains: "We use the Mifflin-St Jeor equation for BMR, multiplied by your activity factor, adjusted for your goal. Macros distribute the resulting calories using your chosen split." This satisfies the curious without cluttering the headline.

If `isFeasible === false`, show the warning prominently above the macro bar (red border, plain language). The user should understand that the displayed grams have been clamped (carbs can't be negative) and the plan needs adjusting.

---

## 4. State + data flow

### 4.1 Form state owner

A single `useForm` instance lives at the wizard root (the `MacroWizard` component). Step components do **not** own their own forms — they receive the form instance via props or context. The current `index.tsx` has each step creating its own `useForm`, which discards values when the step unmounts; this is the first thing to fix.

Default values are derived from URL search params at mount: `searchToFormValues(Route.useSearch())`. Fields that are missing from the URL fall back to schema-friendly defaults (`unit: "metric"`, `sex: "female"`, numbers as `undefined`). Use `formOptions` to declare defaults so they can be shared with any future replays/tests.

### 4.2 URL is canonical

Wire `Route.validateSearch = searchSchema.parse`. On every committed value change (i.e. when the user moves to the next step, *not* on every keystroke — that would spam the history stack), call `navigate({ search: prev => ({...prev, ...currentValues, step: nextStep}) })`.

Two reasons to commit on step transition rather than per keystroke:

- Stable browser history. Each back/forward step is a wizard step, not a typed character.
- Cheaper renders. Per-keystroke URL writes trigger router re-renders.

The `step` param drives which step is visible. If the URL declares `step=3` but `personalStepSchema` doesn't pass, snap back to step 1 (don't trust the URL blindly — see §6.4).

### 4.3 Step gating

The single source of truth for "can we advance" is `validateStep(currentStep, currentValues)`. It is called:

- To enable/disable the Next button (on every render — cheap, all in-memory).
- On Next click — if it returns `ok: false`, surface issues to fields, do not navigate.
- On progress-indicator clicks — only allow jumping back, never forward past an invalid step.

Step 5 has no schema; it is reachable only via the Next on step 4. If a user lands on `step=5` with incomplete values via a hand-crafted URL, snap them to the first incomplete step.

### 4.4 Unit conversion

Internal storage is always metric — `weightKg` in kg, `heightCm` in cm. The unit toggle only affects display. On toggle change:

- Re-render the weight input using `kgToLb(valueKg)` (or vice versa).
- Switch the height input between a single cm input and a ft+in pair.

Do not round values on conversion display — let the formatter handle it (one decimal for lb, integer for cm when typed, one decimal for combined inches). Reversing the toggle must round-trip the same canonical kg/cm value. If the user types in imperial, convert immediately on blur and store the kg/cm result; do not keep parallel imperial state — that path leads to drift.

### 4.5 Reset, edit, share

- **Start over** (step 5): clears the form, navigates to `step=1` with no other search params. Confirm with a small inline confirmation ("Clear all and start again?") because this destroys the user's inputs.
- **Edit inputs** (step 5): navigates to `step=1` *without* clearing values, so the user can tweak weight or activity and click forward through any step that's still valid. Validation runs on each step as normal.
- **Copy link** (step 5): copies `window.location.href` to clipboard. The URL already encodes everything (step + all field values) via `searchSchema`. Show a transient toast confirming the copy. Do **not** add tracking parameters or shorteners — the URL is the artefact.

### 4.6 Persistence beyond URL

No localStorage, no cookies. The URL is the only persistence mechanism for v1. Adding storage later is a separate decision (privacy implications, multi-device sync, etc.) — keep the door open by not coupling components to a storage layer.

---

## 5. Logic + formulas wiring

### 5.1 When to compute what

| Computation | Trigger | Inputs needed |
| --- | --- | --- |
| `bmr` | Step 3 preview, step 4 live card, step 5 results | sex, age, weightKg, heightCm |
| `tdee` | Same as above | bmr + activity |
| `kcalForGoal` | Same as above | tdee + goal |
| `splitMacros` | Step 4 live card, step 5 results | kcal, weightKg, proteinPerKg, fatPct |

Compute on render — these functions are pure and microsecond-cheap. React Compiler is on (`vite.config.ts`), so memoisation is automatic where appropriate. Do not add manual `useMemo` unless profiling shows the compiler missed it (per `CLAUDE.md`).

Always derive — never store derived values in form state. `splitMacros` output should not be a field; it is a render-time computation from the four input fields. Storing derived state invites drift.

### 5.2 What counts as a "completed" step

For navigation purposes, step N is *completed* when `validateStep(N, values)` returns `ok: true`. The progress indicator paints segments based on this, not on "the user has visited this step". A user who fills step 1, jumps back from step 3, and clears their age field has step 1 in an *incomplete* state — its segment should regress to the highlighted (current/incomplete) style, and the Next button on the current step should reflect the new state.

### 5.3 Rounding rules

- Calories: nearest 10 kcal in user-facing text. Internal numbers stay full-precision.
- Macro grams: nearest 1 g.
- Macro percentages: nearest 1 %.
- Weight display (lb): one decimal.
- Height display: integer cm; ft as integer + in as one decimal.
- Multipliers / deltas: as stored (one or two decimals).

Use `Math.round(x * 10) / 10` style helpers, or `Intl.NumberFormat`. Round at the *display* layer, never store rounded numbers in form state — round-tripping a rounded `weightKg` through the unit toggle loses information.

### 5.4 Feasibility

`splitMacros().isFeasible` becomes false when `proteinKcal + fatKcal > targetKcal`. When this happens:

- The carb row shows 0 g and 0 % in the breakdown.
- A non-blocking warning appears (step 4 and step 5).
- The user can still submit and view results — the warning travels with the result so they understand the plan is degenerate.

Do not auto-correct. Auto-correction would obscure the trade-off the user just made. Tell them, give them the back button, let them fix it.

---

## 6. Accessibility + edge cases

### 6.1 Focus management

On step change, move focus to the step's `<h1>` / `<h2>` (whichever the step body owns). Use `tabIndex={-1}` plus a ref to make headings focusable without breaking tab order. On the results step, focus the headline kcal number's container so it is read aloud.

Returning from step 5 to step 1 via "Edit inputs" places focus on the first field (unit toggle), not the heading — the user's intent is to edit, so save them a Tab press.

### 6.2 Keyboard navigation

- Enter inside a single-line input on steps 1–4 submits the step (same as clicking Next) **only if the step is valid**; otherwise it is a no-op.
- Esc has no global handler — leave default browser behaviour.
- The progress indicator is a list of buttons; arrow keys move focus between segments, Enter activates. Disabled segments are skipped.
- Sliders use the native range input under the hood and inherit arrow-key support.

### 6.3 ARIA + announcements

- The shell uses `role="form"` plus a visible label.
- `aria-live="polite"` on a status region announces step changes ("Step 2 of 5. How active are you?") and field-validation summaries ("Age is required.").
- Per-field errors use `aria-describedby` pointing at the inline error text; `aria-invalid` toggles on blur.
- The activity and goal cards expose `role="radio"` inside a `role="radiogroup"` with `aria-checked`. Do not rely on visual selection alone.

### 6.4 Bad URL params

`searchSchema` already has `.catch({})`, so a malformed URL yields an empty seed and the wizard renders step 1 with defaults. Additional guards inside the component:

- If `step` is set but the preceding steps' values do not validate, snap to the first invalid step. Don't error — silently correct the URL.
- If individual field values are out of bounds (e.g. `age=200`), they fail `validateStep` and the user sees the corresponding inline error.
- If the URL declares contradictory values (e.g. `preset=balanced` but `proteinPerKg=3`), the preset chips render with no chip selected (or with "Custom" highlighted) — the slider values win, since they encode the user's actual macro split.

### 6.5 Reduced motion

`@media (prefers-reduced-motion: reduce)` disables the step slide animation and the macro-bar entrance animation. Functional changes only — no visual decoration that depends on motion.

### 6.6 Small viewports

- The activity card grid stacks to a single column under ~480 px.
- The goal cards stack to a single column or remain a 3-up grid depending on label length — measure in implementation.
- Sliders get larger thumbs on touch (`touch-action: pan-y`).
- The progress indicator becomes a compact "2 / 5" pill on widths under ~360 px.

### 6.7 Performance

The whole flow is client-side after the initial SSR. Formulas are pure functions over five to ten numbers — no profiling concerns. URL updates are batched on step transitions (§4.2), so router re-renders stay minimal. Don't add `useMemo`/`useCallback` unless the React Compiler demonstrably misses something.

---

## 7. Implementation checklist

1. Lift form state to `MacroWizard`; thread the form into each step.
2. Wire `Route.validateSearch = searchSchema.parse` and seed defaults from `searchToFormValues`.
3. Implement step gating via `validateStep`; commit values to the URL on step transition only.
4. Build per-step components in `src/routes/calculator/-components/` (TanStack Router treats `-`-prefixed directories as non-route).
5. Add unit conversion display helpers in `src/features/calculator/` if any are missing — keep React-free.
6. Add the progress indicator, slide animation, and focus-management hooks.
7. Verify accessibility: keyboard-only run-through, screen-reader announcements, reduced motion.
8. Manual QA matrix: refresh on each step, share URL between browsers, switch units mid-flow, hit step 4 with `weightKg=300` + `proteinPerKg=4` to confirm infeasibility warning, hand-edit URL to invalid `step=5` and confirm snap-back.

---

## 8. Out of scope (do not build now)

- Saving plans across sessions or accounts.
- Server-side computation — formulas are cheap enough to run in the browser.
- Multiple results presets ("compare cut vs maintain").
- Charts beyond the macro bar.
- Internationalised units beyond metric/imperial.
- Localisation / i18n of strings.

Each of these is a defensible next step but adds surface area we don't need to ship the wizard.
