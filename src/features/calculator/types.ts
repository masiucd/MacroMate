import z from "zod"
import {
	ACTIVITY_LEVELS,
	DIET_PRESET_VALUES,
	GOALS,
	SEXES,
	UNITS,
} from "#/features/calculator/schema"

export const STEP_ORDER = [
	"personal_details",
	"activity_level",
	"goal",
	"macros",
	"preview",
	"result",
] as const

export type Page = (typeof STEP_ORDER)[number]

export const calculatorSearchSchema = z.object({
	page: z.enum(STEP_ORDER).optional().catch(STEP_ORDER[0]),
	unit: z.enum(UNITS).optional().catch("metric"),
	sex: z.enum(SEXES).optional().catch("female"),
	age: z.number().int().min(0).optional().catch(undefined),
	weightKg: z.number().min(0).optional().catch(undefined),
	heightCm: z.number().min(0).optional().catch(undefined),
	activity: z.enum(ACTIVITY_LEVELS).optional().catch(undefined),
	goal: z.enum(GOALS).optional().catch(undefined),
	preset: z.enum(DIET_PRESET_VALUES).optional().catch(undefined),
	proteinPerKg: z.number().min(0).optional().catch(undefined),
	fatPct: z.number().min(0).max(1).optional().catch(undefined),
})

export type CalculatorSearchParams = z.infer<typeof calculatorSearchSchema>
