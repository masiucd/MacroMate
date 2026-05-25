# Roadmap: Macro Calculator

**Granularity:** Coarse (3 phases)
**Total v1 Requirements:** 25
**Coverage:** 100% ✓

---

## Phase 1: Calculation Engine

**Goal:** Build and test the pure calculation library that powers all macro outputs.

**Requirements:** CALC-01, CALC-02, CALC-03, CALC-04, CALC-05, CALC-06

**Success Criteria:**
1. Given known inputs (male, 30, 75kg, 175cm, moderately active), BMR calculates to ~1696 kcal and TDEE to ~2630 kcal
2. Calorie floor prevents results below 1200 kcal (women) / 1500 kcal (men)
3. Protein targets are in range 1.6–2.4g/kg depending on goal
4. All four goals produce distinct, valid macro splits
5. Unit conversion functions correctly convert lbs↔kg and ft/in↔cm with no rounding errors

---

## Phase 2: Wizard UI

**Goal:** Build the full 3-step wizard: Stats form → Goal selection → Results, mobile-first.

**Requirements:** WIZ-01, WIZ-02, WIZ-03, STAT-01, STAT-02, STAT-03, STAT-04, STAT-05, STAT-06, STAT-07, STAT-08, GOAL-01, GOAL-02

**Success Criteria:**
1. User on mobile can complete all 3 steps without needing to switch keyboard type
2. Switching unit system (metric ↔ imperial) on step 1 updates all field labels and placeholders correctly
3. Submitting step 1 with missing or out-of-range values shows a clear inline error, not a browser alert
4. User can navigate back from step 2 to step 1 and retain previously entered values
5. Activity level options show enough description that a sedentary office worker would not select "very active"

---

## Phase 3: Results & Polish

**Goal:** Display macro results with goal explanation, wire wizard to calculation engine, and ship.

**Requirements:** RES-01, RES-02, RES-03, RES-04, RES-05, WIZ-04

**Success Criteria:**
1. After completing the wizard, results screen shows calories and all three macros in grams
2. Results screen shows a goal-specific explanation (different text for each of the 4 goals)
3. "Start over" button on results returns user to step 1 with cleared inputs
4. App loads and is fully usable on a mid-range Android device on 4G in under 3 seconds
5. App renders correctly on 375px wide viewport (iPhone SE) without horizontal scrolling

---

## Requirement Traceability

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

**Coverage:** 25/25 v1 requirements mapped ✓

---
*Created: 2025-05-25*
