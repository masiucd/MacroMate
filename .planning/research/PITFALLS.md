# Pitfalls Research: Macro Calculator Web App

## P1 — Wrong BMR Formula

**Description:** Using Harris-Benedict (1919) instead of Mifflin-St Jeor (1990). Harris-Benedict overestimates BMR by 5-15%, especially for overweight individuals.

**Warning signs:** Results feel "too high" when testing with known values.

**Prevention:** Use Mifflin-St Jeor as the default. Document the formula choice in code. Add a unit test with known BMR reference values (e.g., male, 30yo, 75kg, 175cm → ~1696 kcal/day).

**Phase:** Calculation library (Phase 1)

---

## P2 — Unit Conversion Bugs

**Description:** Mixing metric and imperial mid-calculation. E.g., storing weight in lbs but formula expects kg, or height in ft but formula expects cm.

**Warning signs:** Results are wildly off for imperial users. Off by ~2.2x or ~2.54x.

**Prevention:** Store all values in metric internally (kg, cm). Convert only at the input/display boundary. Type aliases (`Kg`, `Cm`) in TypeScript to prevent accidental mixing.

**Phase:** Calculation library + Stats form (Phase 1)

---

## P3 — Activity Multiplier Misapplication

**Description:** Activity multipliers (1.2 → 1.9) are widely misunderstood. Users consistently overestimate their activity level, leading to inflated TDEE and no fat loss despite "eating at a deficit."

**Warning signs:** "Very active" option selected by office workers.

**Prevention:** Write descriptive labels for each activity level. E.g., "Very active — hard exercise 6-7 days/week or physical job." Don't just say "very active."

**Phase:** Stats form (Phase 1)

---

## P4 — Overly Aggressive Deficit/Surplus

**Description:** Setting calorie deficit at 500+ kcal/day (1 lb/week) by default. For lighter users, this can push calories dangerously low (below 1200 kcal for women, 1500 for men).

**Warning signs:** Female user, 55kg, sedentary → calculated at 900 kcal/day.

**Prevention:** Apply minimum calorie floors (1200 kcal women / 1500 kcal men). Use a moderate deficit of ~15-20% rather than 500 kcal flat. Note this in results if floor was applied.

**Phase:** Calculation library (Phase 1)

---

## P5 — Poor Mobile Input UX

**Description:** Number inputs on mobile default to text keyboards, not numeric. Users must manually switch. Height with feet + inches is especially awkward.

**Warning signs:** Testing on actual mobile device (not just Chrome DevTools).

**Prevention:** `inputmode="numeric"` or `type="number"` on all numeric inputs. For ft+in, use two separate inputs (feet, inches) rather than one text field.

**Phase:** Stats form (Phase 2)

---

## P6 — No Input Validation Ranges

**Description:** Users can enter nonsense values (age: 0, weight: 1000kg) that produce nonsensical results and damage trust.

**Warning signs:** No min/max on input fields.

**Prevention:** Validate reasonable ranges: age 13-100, weight 30-300kg (66-660lbs), height 100-250cm (3'3"–8'2"). Show friendly error messages, not browser-default ones.

**Phase:** Stats form (Phase 2)

---

## P7 — Protein Recommendations Too Low

**Description:** Using 0.8g/kg (RDA baseline) for protein. For fitness-goal users, this is inadequate. Users chasing muscle gain or fat loss with low protein get poor results and blame the app.

**Warning signs:** Protein < 1.6g/kg for muscle building goal.

**Prevention:** Use evidence-based sport nutrition targets:
- Lose fat: 2.0-2.4g/kg (preserve muscle in deficit)
- Maintain: 1.6-2.0g/kg
- Build muscle: 1.8-2.2g/kg
- Strength: 1.8-2.4g/kg

**Phase:** Calculation library (Phase 1)

---
*Written: 2025-05-25*
