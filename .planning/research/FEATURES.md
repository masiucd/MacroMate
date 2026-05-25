# Features Research: Macro Calculator Web App

## Table Stakes (must have or users leave)

### Input Collection
- **Age** — affects TDEE calculation (BMR decreases with age)
- **Sex** (male/female) — Mifflin-St Jeor formula differs by sex
- **Weight** — kg or lbs
- **Height** — cm or ft/in
- **Activity level** — sedentary / lightly active / moderately active / very active / extremely active
- **Fitness goal** — lose fat / maintain / build muscle / strength & performance
- **Unit system toggle** — metric vs imperial (users abandon apps that force metric/imperial)

### Calculation Engine
- **BMR** via Mifflin-St Jeor formula (most accurate for general population, 2025 standard)
- **TDEE** = BMR × activity multiplier
- **Macro split** adjusted per goal:
  - Lose fat: caloric deficit (~20%), higher protein (to preserve muscle), lower carbs
  - Maintain: TDEE calories, moderate split
  - Build muscle: caloric surplus (~10-15%), high protein, high carbs
  - Strength/performance: similar to build muscle but slightly higher carbs for fuel

### Results Display
- Daily calorie target
- Protein in grams (and % of calories)
- Carbohydrates in grams (and % of calories)
- Fat in grams (and % of calories)
- Brief explanation of why these numbers (builds trust)

### UX
- Multi-step wizard with progress indicator
- Input validation with clear error messages
- "Recalculate" / "Start over" option from results

## Differentiators (competitive advantage)

- **Goal explanation** — brief blurb explaining the macro rationale for their goal
- **Macro visualization** — pie chart or bar showing protein/carb/fat split
- **Calorie breakdown context** — e.g., "roughly 3 meals of X calories each"
- **Imperial/metric toggle on same screen** — live unit conversion without page reload
- **Shareable results** — URL params encoding results so users can share/bookmark

## Anti-Features (deliberately NOT build)

| Feature | Why avoid |
|---------|-----------|
| Food tracking / logging | App complexity explodes; separate product category |
| Meal plan generation | Requires food database, massively out of scope |
| User accounts / history | Kills stateless simplicity; adds auth complexity |
| Keto/carnivore/vegan-specific modes | Fragments UX; advanced edge case for v1 |
| AI-powered recommendations | Adds latency, cost, and trust issues |
| Social features | Off-mission entirely |

## Feature Dependencies

```
Unit toggle → all inputs (affects validation ranges)
Stats inputs → BMR calculation
Activity level → TDEE calculation
Goal selection → Macro split calculation
All of above → Results display
```

---
*Written: 2025-05-25*
