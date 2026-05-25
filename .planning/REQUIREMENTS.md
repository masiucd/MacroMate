# Requirements: Macro Calculator

**Defined:** 2025-05-25
**Core Value:** A user gets their daily macro targets in under a minute with zero friction — no signup, no bloat, just enter stats and get numbers.

## v1 Requirements

### Wizard UX

- [ ] **WIZ-01**: User sees a 3-step wizard: Stats → Goal → Results
- [ ] **WIZ-02**: User sees a progress indicator showing current step
- [ ] **WIZ-03**: User can navigate back to a previous step
- [ ] **WIZ-04**: User can start over from the results screen

### Stats Input

- [ ] **STAT-01**: User can toggle between metric (kg/cm) and imperial (lbs/ft+in)
- [ ] **STAT-02**: User can enter age (validated: 13–100)
- [ ] **STAT-03**: User can select sex (male / female)
- [ ] **STAT-04**: User can enter weight in selected unit system
- [ ] **STAT-05**: User can enter height in selected unit system (imperial: separate ft and in fields)
- [ ] **STAT-06**: User can select activity level with descriptive labels (sedentary through extremely active)
- [ ] **STAT-07**: User sees validation errors for out-of-range or missing inputs
- [ ] **STAT-08**: Numeric inputs use mobile-optimized keyboard (`inputmode="numeric"`)

### Goal Selection

- [ ] **GOAL-01**: User can select one of 4 goals: Lose Fat / Maintain / Build Muscle / Strength & Performance
- [ ] **GOAL-02**: Each goal shows a brief description of what it means

### Calculation Engine

- [ ] **CALC-01**: App calculates BMR using Mifflin-St Jeor formula
- [ ] **CALC-02**: App calculates TDEE by applying activity multiplier to BMR
- [ ] **CALC-03**: App adjusts calories based on goal (deficit for lose fat, surplus for build muscle/strength)
- [ ] **CALC-04**: App applies calorie floor (1200 kcal women / 1500 kcal men) to prevent unsafe results
- [ ] **CALC-05**: App calculates protein using sport nutrition targets (1.6–2.4g/kg depending on goal)
- [ ] **CALC-06**: App calculates carbs and fat to fill remaining calories per goal split

### Results Display

- [ ] **RES-01**: User sees daily calorie target
- [ ] **RES-02**: User sees protein target in grams
- [ ] **RES-03**: User sees carbohydrate target in grams
- [ ] **RES-04**: User sees fat target in grams
- [ ] **RES-05**: User sees a brief explanation of why these macros suit their goal

## v2 Requirements

### Enhanced Results

- **V2-01**: Macro visualization (pie chart or bar showing protein/carbs/fat split)
- **V2-02**: Per-meal breakdown (e.g., "3 meals of ~X calories each")
- **V2-03**: Shareable results via URL params

### Additional Features

- **V2-04**: Body fat % input for more precise lean mass calculations
- **V2-05**: Maintenance calories shown alongside goal-adjusted calories for context

## Out of Scope

| Feature | Reason |
|---------|--------|
| User accounts / history | Stateless by design; signup kills conversion |
| Food logging / tracking | Separate product category entirely |
| Meal plan generation | Requires food database, out of scope for v1 |
| Native mobile app | Mobile-first web is sufficient |
| AI-powered recommendations | Adds latency, cost, trust issues |
| Social / sharing features | Off-mission for v1 |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CALC-01 | Phase 1 | Pending |
| CALC-02 | Phase 1 | Pending |
| CALC-03 | Phase 1 | Pending |
| CALC-04 | Phase 1 | Pending |
| CALC-05 | Phase 1 | Pending |
| CALC-06 | Phase 1 | Pending |
| WIZ-01 | Phase 2 | Pending |
| WIZ-02 | Phase 2 | Pending |
| WIZ-03 | Phase 2 | Pending |
| STAT-01 | Phase 2 | Pending |
| STAT-02 | Phase 2 | Pending |
| STAT-03 | Phase 2 | Pending |
| STAT-04 | Phase 2 | Pending |
| STAT-05 | Phase 2 | Pending |
| STAT-06 | Phase 2 | Pending |
| STAT-07 | Phase 2 | Pending |
| STAT-08 | Phase 2 | Pending |
| GOAL-01 | Phase 2 | Pending |
| GOAL-02 | Phase 2 | Pending |
| RES-01 | Phase 3 | Pending |
| RES-02 | Phase 3 | Pending |
| RES-03 | Phase 3 | Pending |
| RES-04 | Phase 3 | Pending |
| RES-05 | Phase 3 | Pending |
| WIZ-04 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 25 total
- Mapped to phases: 25
- Unmapped: 0 ✓

---
*Requirements defined: 2025-05-25*
*Last updated: 2025-05-25 after initial definition*
