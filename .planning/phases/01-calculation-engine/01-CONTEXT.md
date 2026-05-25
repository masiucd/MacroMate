# Phase 1: Calculation Engine - Context

**Gathered:** 2025-05-25
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the pure calculation library that powers all macro outputs. No UI. Implements BMR (Mifflin-St Jeor), TDEE (BMR × activity multiplier), goal-based calorie adjustment, calorie floors, and macro splits. Output is a `MacroResult` object consumed by the wizard in Phase 2. Fully unit-testable pure functions.

</domain>

<decisions>
## Implementation Decisions

### BMR Formula
- Use Mifflin-St Jeor (1990), not Harris-Benedict
- Sex input: Male / Female only (binary) — formula is defined for these two values
- Store all values in metric internally (kg, cm); unit conversion happens at the boundary

### Calorie Adjustment per Goal
- **Lose Fat**: 15–20% caloric deficit below TDEE
- **Maintain**: TDEE calories (no adjustment)
- **Build Muscle**: 10–15% caloric surplus above TDEE
- **Strength & Performance**: 10–15% caloric surplus above TDEE (same as build muscle, but carb-focused split)
- Apply calorie floor: 1200 kcal for female, 1500 kcal for male — if adjusted calories fall below floor, clamp to floor

### Protein Targets (per goal)
- **Lose Fat**: 2.0–2.4g/kg — high protein to preserve muscle in deficit
- **Maintain**: 2.0g/kg — matches other goals for simplicity
- **Build Muscle**: 2.0–2.4g/kg — matches lose fat targets
- **Strength & Performance**: 2.0–2.4g/kg — same as above

Use the midpoint of the range (2.2g/kg) as the default output value. This simplifies the calc without needing user input on exact protein aggressiveness.

### Carb/Fat Balance
- User can choose their carb/fat split preference as an extra input in the wizard (Phase 2 handles the UI)
- The calculation library must accept a `carbFatPreference` parameter: one of `low-carb | balanced | high-carb`
- Implementation of exact ratios per preference: Claude's discretion
- For Strength & Performance goal, carb-focused split is the default even on "balanced" — more carbs than Build Muscle

### Claude's Discretion
- Exact protein gram choice within the 2.0–2.4g/kg range
- Exact carb/fat ratios for each `carbFatPreference` value
- Compression algorithm / rounding strategy for gram outputs
- TypeScript type aliases for units (e.g., `Kg`, `Cm`) to prevent accidental mixing

</decisions>

<specifics>
## Specific Ideas

- The wizard adds a carb/fat preference input step — the calc library must be designed to accept it as a parameter, not hardcode a split
- Strength & Performance goal should feel distinct from Build Muscle primarily through its higher-carb default split

</specifics>

<canonical_refs>
## Canonical References

No external specs — requirements are fully captured in decisions above and in:

### Requirements
- `.planning/REQUIREMENTS.md` — CALC-01 through CALC-06, defines what the engine must do
- `.planning/research/PITFALLS.md` — P1 (BMR formula), P2 (unit conversion), P4 (calorie floor), P7 (protein targets)
- `.planning/research/ARCHITECTURE.md` — Proposed file structure (`src/lib/bmr.ts`, `tdee.ts`, `macros.ts`, `units.ts`)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing code

### Established Patterns
- None yet — this phase establishes the foundation

### Integration Points
- Phase 2 (Wizard UI) will import `calculateMacros(stats, goal, carbFatPreference) → MacroResult`
- `MacroResult` shape should include: `{ calories, protein, carbs, fat }` all in grams/kcal

</code_context>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-calculation-engine*
*Context gathered: 2025-05-25*
