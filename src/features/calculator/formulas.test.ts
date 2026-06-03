import {describe, expect, it} from "vitest"
import {
	ACTIVITY_MULTIPLIERS,
	BOUNDS,
	bmr,
	cmToFtIn,
	DIET_PRESETS,
	ftInToCm,
	GOAL_DELTAS,
	KCAL_PER_G,
	kcalForGoal,
	kgToLb,
	lbToKg,
	splitMacros,
	tdee,
} from "./formulas"

const approx = (actual: number, expected: number, tolerance = 0.01) => {
	expect(Math.abs(actual - expected)).toBeLessThanOrEqual(tolerance)
}

describe("bmr (Mifflin-St Jeor)", () => {
	it("computes male BMR", () => {
		// 30yo male, 80 kg, 180 cm: 10*80 + 6.25*180 - 5*30 + 5 = 800 + 1125 - 150 + 5 = 1780
		expect(bmr({sex: "male", weightKg: 80, heightCm: 180, age: 30})).toBe(1780)
	})

	it("computes female BMR", () => {
		// 30yo female, 65 kg, 165 cm: 10*65 + 6.25*165 - 5*30 - 161 = 650 + 1031.25 - 150 - 161 = 1370.25
		approx(bmr({sex: "female", weightKg: 65, heightCm: 165, age: 30}), 1370.25)
	})

	it("scales linearly with weight", () => {
		const a = bmr({sex: "male", weightKg: 70, heightCm: 175, age: 25})
		const b = bmr({sex: "male", weightKg: 80, heightCm: 175, age: 25})
		expect(b - a).toBe(100) // 10 kg * 10 kcal/kg
	})

	it("scales linearly with height", () => {
		const a = bmr({sex: "male", weightKg: 75, heightCm: 170, age: 25})
		const b = bmr({sex: "male", weightKg: 75, heightCm: 180, age: 25})
		approx(b - a, 62.5) // 10 cm * 6.25 kcal/cm
	})

	it("decreases with age", () => {
		const young = bmr({sex: "male", weightKg: 75, heightCm: 175, age: 20})
		const old = bmr({sex: "male", weightKg: 75, heightCm: 175, age: 60})
		expect(young - old).toBe(200) // 40 years * 5 kcal/year
	})

	it("male BMR exceeds female by 166 kcal at identical anthropometrics", () => {
		const male = bmr({sex: "male", weightKg: 70, heightCm: 175, age: 30})
		const female = bmr({sex: "female", weightKg: 70, heightCm: 175, age: 30})
		expect(male - female).toBe(166) // 5 - (-161)
	})
})

describe("tdee", () => {
	it("multiplies BMR by the activity factor for each level", () => {
		const base = 1780
		for (const [level, mult] of Object.entries(ACTIVITY_MULTIPLIERS)) {
			approx(tdee(base, level as keyof typeof ACTIVITY_MULTIPLIERS), base * mult)
		}
	})

	it("uses 1.55 for moderate", () => {
		expect(tdee(2000, "moderate")).toBe(3100)
	})
})

describe("kcalForGoal", () => {
	it("subtracts 20% on cut", () => {
		expect(kcalForGoal(2500, "cut")).toBe(2000)
	})

	it("passes through on maintain", () => {
		expect(kcalForGoal(2500, "maintain")).toBe(2500)
	})

	it("adds 15% on bulk", () => {
		expect(kcalForGoal(2000, "bulk")).toBe(2300)
	})

	it("matches GOAL_DELTAS constants", () => {
		for (const [goal, delta] of Object.entries(GOAL_DELTAS)) {
			approx(kcalForGoal(2000, goal as keyof typeof GOAL_DELTAS), 2000 * (1 + delta))
		}
	})
})

describe("splitMacros", () => {
	it("computes balanced preset for a 2000 kcal / 80 kg user", () => {
		const {proteinPerKg, fatPct} = DIET_PRESETS.balanced
		const r = splitMacros({kcal: 2000, weightKg: 80, proteinPerKg, fatPct})
		// protein: 1.6 * 80 = 128 g -> 512 kcal (25.6%)
		// fat: 30% of 2000 = 600 kcal -> 66.67 g
		// carbs: 2000 - 512 - 600 = 888 kcal -> 222 g
		expect(r.proteinG).toBe(128)
		approx(r.fatG, 66.67)
		approx(r.carbsG, 222)
		approx(r.proteinPct, 0.256)
		approx(r.fatPct, 0.3)
		approx(r.carbsPct, 0.444)
		expect(r.isFeasible).toBe(true)
	})

	it("computes high-protein preset", () => {
		const {proteinPerKg, fatPct} = DIET_PRESETS["high-protein"]
		const r = splitMacros({kcal: 2200, weightKg: 75, proteinPerKg, fatPct})
		// protein: 2.2 * 75 = 165 g -> 660 kcal (30%)
		// fat: 25% of 2200 = 550 kcal -> 61.11 g
		// carbs: 2200 - 660 - 550 = 990 kcal -> 247.5 g
		expect(r.proteinG).toBe(165)
		approx(r.fatG, 61.11)
		approx(r.carbsG, 247.5)
		expect(r.isFeasible).toBe(true)
	})

	it("computes low-carb preset", () => {
		const {proteinPerKg, fatPct} = DIET_PRESETS["low-carb"]
		const r = splitMacros({kcal: 2000, weightKg: 80, proteinPerKg, fatPct})
		// protein: 1.8 * 80 = 144 g -> 576 kcal
		// fat: 50% of 2000 = 1000 kcal -> 111.11 g
		// carbs: 2000 - 576 - 1000 = 424 kcal -> 106 g
		expect(r.proteinG).toBe(144)
		approx(r.fatG, 111.11)
		approx(r.carbsG, 106)
		expect(r.isFeasible).toBe(true)
	})

	it("computes keto preset", () => {
		const {proteinPerKg, fatPct} = DIET_PRESETS.keto
		const r = splitMacros({kcal: 2000, weightKg: 80, proteinPerKg, fatPct})
		// protein: 1.8 * 80 = 144 g -> 576 kcal
		// fat: 70% of 2000 = 1400 kcal -> 155.56 g
		// carbs: 2000 - 576 - 1400 = 24 kcal -> 6 g
		expect(r.proteinG).toBe(144)
		approx(r.fatG, 155.56)
		approx(r.carbsG, 6)
		expect(r.isFeasible).toBe(true)
	})

	it("flags infeasible split (protein + fat > kcal) and clamps carbs to 0", () => {
		// Keto preset on aggressive cut for heavy user
		const {proteinPerKg, fatPct} = DIET_PRESETS.keto
		const r = splitMacros({kcal: 1500, weightKg: 100, proteinPerKg, fatPct})
		// protein: 1.8 * 100 = 180 g -> 720 kcal
		// fat: 70% of 1500 = 1050 kcal
		// sum: 1770 kcal > 1500 -> infeasible
		expect(r.isFeasible).toBe(false)
		expect(r.carbsG).toBe(0)
		expect(r.carbsPct).toBe(0)
	})

	it("percentages reflect actual kcal, not normalised when infeasible", () => {
		const r = splitMacros({kcal: 1500, weightKg: 100, proteinPerKg: 1.8, fatPct: 0.7})
		// proteinPct + fatPct may exceed 1 in this case — that's the signal.
		expect(r.proteinPct + r.fatPct).toBeGreaterThan(1)
	})
})

describe("unit conversions", () => {
	it("round-trips kg <-> lb", () => {
		approx(lbToKg(kgToLb(80)), 80, 1e-9)
		approx(kgToLb(lbToKg(176)), 176, 1e-9)
	})

	it("lb to kg uses 0.45359237", () => {
		approx(lbToKg(100), 45.359237, 1e-6)
	})

	it("ftInToCm: 5'10\" ~ 177.8 cm", () => {
		approx(ftInToCm(5, 10), 177.8, 0.01)
	})

	it("cmToFtIn: 180 cm -> 5 ft 10.866 in", () => {
		const {ft, inches} = cmToFtIn(180)
		expect(ft).toBe(5)
		approx(inches, 10.866, 0.01)
	})

	it("ftInToCm and cmToFtIn round-trip", () => {
		const cm = ftInToCm(6, 2)
		const {ft, inches} = cmToFtIn(cm)
		expect(ft).toBe(6)
		approx(inches, 2, 1e-9)
	})
})

describe("constants sanity", () => {
	it("KCAL_PER_G matches Atwater factors", () => {
		expect(KCAL_PER_G.protein).toBe(4)
		expect(KCAL_PER_G.carbs).toBe(4)
		expect(KCAL_PER_G.fat).toBe(9)
	})

	it("BOUNDS are ordered min < max", () => {
		expect(BOUNDS.ageMin).toBeLessThan(BOUNDS.ageMax)
		expect(BOUNDS.weightKgMin).toBeLessThan(BOUNDS.weightKgMax)
		expect(BOUNDS.heightCmMin).toBeLessThan(BOUNDS.heightCmMax)
	})

	it("activity multipliers strictly increase", () => {
		const order: (keyof typeof ACTIVITY_MULTIPLIERS)[] = [
			"sedentary",
			"light",
			"moderate",
			"very",
			"extra",
		]
		for (let i = 1; i < order.length; i++) {
			expect(ACTIVITY_MULTIPLIERS[order[i]]).toBeGreaterThan(ACTIVITY_MULTIPLIERS[order[i - 1]])
		}
	})

	it("goal deltas: cut < maintain < bulk", () => {
		expect(GOAL_DELTAS.cut).toBeLessThan(GOAL_DELTAS.maintain)
		expect(GOAL_DELTAS.maintain).toBeLessThan(GOAL_DELTAS.bulk)
	})

	it("all diet presets have valid proportions", () => {
		for (const preset of Object.values(DIET_PRESETS)) {
			expect(preset.proteinPerKg).toBeGreaterThan(0)
			expect(preset.fatPct).toBeGreaterThan(0)
			expect(preset.fatPct).toBeLessThanOrEqual(1)
		}
	})
})
