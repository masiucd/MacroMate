import {describe, expect, it} from "vitest"
import {
	activityStepSchema,
	formSchema,
	goalStepSchema,
	macrosStepSchema,
	personalStepSchema,
	searchSchema,
	searchToFormValues,
	stepSchemas,
	validateStep,
} from "./schema"

const validFullValues = {
	unit: "metric" as const,
	sex: "male" as const,
	age: 30,
	weightKg: 80,
	heightCm: 180,
	activity: "moderate" as const,
	goal: "maintain" as const,
	preset: "balanced" as const,
	proteinPerKg: 1.6,
	fatPct: 0.3,
}

describe("formSchema", () => {
	it("accepts a valid full object", () => {
		expect(formSchema.safeParse(validFullValues).success).toBe(true)
	})

	it("rejects age below bound", () => {
		expect(formSchema.safeParse({...validFullValues, age: 13}).success).toBe(false)
	})

	it("rejects age above bound", () => {
		expect(formSchema.safeParse({...validFullValues, age: 101}).success).toBe(false)
	})

	it("rejects non-integer age", () => {
		expect(formSchema.safeParse({...validFullValues, age: 30.5}).success).toBe(false)
	})

	it("rejects weight below bound", () => {
		expect(formSchema.safeParse({...validFullValues, weightKg: 29}).success).toBe(false)
	})

	it("rejects weight above bound", () => {
		expect(formSchema.safeParse({...validFullValues, weightKg: 301}).success).toBe(false)
	})

	it("rejects height below bound", () => {
		expect(formSchema.safeParse({...validFullValues, heightCm: 99}).success).toBe(false)
	})

	it("rejects unknown sex value", () => {
		expect(formSchema.safeParse({...validFullValues, sex: "other"}).success).toBe(false)
	})

	it("rejects unknown activity value", () => {
		expect(formSchema.safeParse({...validFullValues, activity: "extreme"}).success).toBe(false)
	})

	it("rejects unknown goal value", () => {
		expect(formSchema.safeParse({...validFullValues, goal: "shred"}).success).toBe(false)
	})

	it("rejects unknown preset value", () => {
		expect(formSchema.safeParse({...validFullValues, preset: "paleo"}).success).toBe(false)
	})

	it("accepts custom preset", () => {
		expect(formSchema.safeParse({...validFullValues, preset: "custom"}).success).toBe(true)
	})

	it("rejects proteinPerKg out of bounds", () => {
		expect(formSchema.safeParse({...validFullValues, proteinPerKg: 0.4}).success).toBe(false)
		expect(formSchema.safeParse({...validFullValues, proteinPerKg: 4.1}).success).toBe(false)
	})

	it("rejects fatPct out of bounds", () => {
		expect(formSchema.safeParse({...validFullValues, fatPct: 0.05}).success).toBe(false)
		expect(formSchema.safeParse({...validFullValues, fatPct: 0.9}).success).toBe(false)
	})
})

describe("step picks", () => {
	it("personalStepSchema requires only personal fields", () => {
		const result = personalStepSchema.safeParse({
			unit: "metric",
			sex: "female",
			age: 28,
			weightKg: 65,
			heightCm: 165,
		})
		expect(result.success).toBe(true)
	})

	it("personalStepSchema rejects missing field", () => {
		const result = personalStepSchema.safeParse({
			unit: "metric",
			sex: "female",
			age: 28,
			weightKg: 65,
		})
		expect(result.success).toBe(false)
	})

	it("activityStepSchema accepts only activity", () => {
		expect(activityStepSchema.safeParse({activity: "light"}).success).toBe(true)
	})

	it("goalStepSchema accepts only goal", () => {
		expect(goalStepSchema.safeParse({goal: "bulk"}).success).toBe(true)
	})

	it("macrosStepSchema requires preset + proteinPerKg + fatPct", () => {
		expect(
			macrosStepSchema.safeParse({preset: "keto", proteinPerKg: 1.8, fatPct: 0.7}).success,
		).toBe(true)
		expect(macrosStepSchema.safeParse({preset: "keto", proteinPerKg: 1.8}).success).toBe(false)
	})

	it("stepSchemas map exposes all four input steps", () => {
		expect(Object.keys(stepSchemas).sort()).toEqual(["1", "2", "3", "4"])
	})
})

describe("validateStep", () => {
	it("returns ok on valid input", () => {
		const result = validateStep(2, {activity: "very"})
		expect(result.ok).toBe(true)
	})

	it("returns issues on invalid input", () => {
		const result = validateStep(1, {unit: "metric", sex: "male", age: 30, weightKg: 80})
		expect(result.ok).toBe(false)
		if (!result.ok) {
			expect(result.issues.length).toBeGreaterThan(0)
		}
	})
})

describe("searchSchema", () => {
	it("accepts empty object", () => {
		expect(searchSchema.safeParse({}).success).toBe(true)
	})

	it("coerces numeric strings to numbers", () => {
		const result = searchSchema.safeParse({
			step: "3",
			age: "28",
			weightKg: "72.5",
			heightCm: "168",
			fatPct: "0.4",
		})
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.step).toBe(3)
			expect(result.data.age).toBe(28)
			expect(result.data.weightKg).toBe(72.5)
			expect(result.data.heightCm).toBe(168)
			expect(result.data.fatPct).toBe(0.4)
		}
	})

	it("accepts partial input", () => {
		const result = searchSchema.safeParse({step: 2, sex: "female"})
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.step).toBe(2)
			expect(result.data.sex).toBe("female")
			expect(result.data.age).toBeUndefined()
		}
	})

	it("falls back to {} on entirely bogus input via .catch", () => {
		const result = searchSchema.parse("not an object" as unknown)
		expect(result).toEqual({})
	})

	it("rejects step out of 1..STEP_COUNT range via .catch -> {}", () => {
		const result = searchSchema.parse({step: 99})
		expect(result).toEqual({})
	})

	it("rejects unknown enum values via .catch -> {}", () => {
		const result = searchSchema.parse({sex: "other"})
		expect(result).toEqual({})
	})
})

describe("searchToFormValues", () => {
	it("strips step and keeps form fields", () => {
		const result = searchToFormValues({
			step: 3,
			unit: "metric",
			age: 30,
			weightKg: 80,
		})
		expect(result).toEqual({unit: "metric", age: 30, weightKg: 80})
		expect("step" in result).toBe(false)
	})

	it("handles empty input", () => {
		expect(searchToFormValues({})).toEqual({})
	})
})
