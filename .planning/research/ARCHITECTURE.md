# Architecture Research: Macro Calculator Web App

## Overview

A pure client-side React app with a multi-step wizard pattern. No server, no database, no API calls. All computation is local.

## Component Architecture

```
App
├── WizardShell          ← manages current step, collected data
│   ├── StepIndicator    ← visual progress (Step 1 of 3)
│   ├── Step1_Stats      ← age, sex, weight, height, activity level, units
│   ├── Step2_Goal       ← goal selection (lose fat / maintain / build muscle / strength)
│   └── Step3_Results    ← calculated macros display
└── UnitToggle           ← metric/imperial (accessible from step 1)
```

## Data Flow

```
User input (Step 1)
  → UserStats { age, sex, weight, height, activityLevel, units }
  → stored in WizardShell state

User input (Step 2)
  → goal: 'lose_fat' | 'maintain' | 'build_muscle' | 'strength'
  → stored in WizardShell state

Step 3 render
  → calculateMacros(stats, goal) → MacroResult { calories, protein, carbs, fat }
  → displayed in results component
```

## Calculation Layer (pure functions, no UI)

```
src/
  lib/
    bmr.ts          ← Mifflin-St Jeor formula
    tdee.ts         ← BMR × activity multiplier
    macros.ts       ← goal-based macro split from TDEE
    units.ts        ← kg↔lbs, cm↔ft/in conversions
    index.ts        ← calculateMacros(stats, goal) → MacroResult
```

Keeping calculation logic in pure functions (no React deps) enables:
- Easy unit testing (Vitest)
- Reuse across components
- Easier to audit/fix formula bugs

## Suggested Build Order

1. **Calculation library** (`src/lib/`) — pure functions, fully testable, no UI needed
2. **WizardShell + routing** — step navigation, state management
3. **Step 1: Stats form** — inputs with validation
4. **Step 2: Goal selection** — simpler UI step
5. **Step 3: Results display** — reads from wizard state, renders macros
6. **Polish** — mobile styling, transitions, unit toggle UX

Dependencies: Calculation lib must exist before Results. Forms before wizard shell navigation.

## State Shape

```typescript
interface WizardState {
  step: 1 | 2 | 3;
  stats: {
    age: number;
    sex: 'male' | 'female';
    weight: number;      // stored in kg internally
    height: number;      // stored in cm internally
    activityLevel: ActivityLevel;
    units: 'metric' | 'imperial';
  } | null;
  goal: Goal | null;
}
```

Store all values in metric internally. Convert for display only. This prevents unit bugs.

---
*Written: 2025-05-25*
