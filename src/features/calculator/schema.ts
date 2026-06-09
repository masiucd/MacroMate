import {z} from "zod"
import {BOUNDS} from "./formulas"

export const UNITS = ["metric", "imperial"] as const
export type Unit = (typeof UNITS)[number]

export const SEXES = ["male", "female"] as const
export const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "very", "extra"] as const
export const GOALS = ["cut", "maintain", "bulk"] as const
export const DIET_PRESET_VALUES = [
	"balanced",
	"high-protein",
	"low-carb",
	"keto",
	"custom",
] as const

export const STEP_COUNT = 5
export const STEPS = [1, 2, 3, 4, 5] as const
export type Step = (typeof STEPS)[number]

export const PROTEIN_PER_KG_BOUNDS = {min: 0.5, max: 4} as const
export const FAT_PCT_BOUNDS = {min: 0.1, max: 0.85} as const

export const formSchema = z.object({
	unit: z.enum(UNITS),
	sex: z.enum(SEXES),
	age: z.number().int().min(BOUNDS.ageMin).max(BOUNDS.ageMax),
	weightKg: z.number().min(BOUNDS.weightKgMin).max(BOUNDS.weightKgMax),
	heightCm: z.number().min(BOUNDS.heightCmMin).max(BOUNDS.heightCmMax),
	activity: z.enum(ACTIVITY_LEVELS),
	goal: z.enum(GOALS),
	preset: z.enum(DIET_PRESET_VALUES),
	proteinPerKg: z.number().min(PROTEIN_PER_KG_BOUNDS.min).max(PROTEIN_PER_KG_BOUNDS.max),
	fatPct: z.number().min(FAT_PCT_BOUNDS.min).max(FAT_PCT_BOUNDS.max),
})

export type FormValues = z.infer<typeof formSchema>

export const personalStepSchema = formSchema.pick({
	unit: true,
	sex: true,
	age: true,
	weightKg: true,
	heightCm: true,
})

export const activityStepSchema = formSchema.pick({activity: true})
export const goalStepSchema = formSchema.pick({goal: true})
export const macrosStepSchema = formSchema.pick({
	preset: true,
	proteinPerKg: true,
	fatPct: true,
})

export const stepSchemas = {
	1: personalStepSchema,
	2: activityStepSchema,
	3: goalStepSchema,
	4: macrosStepSchema,
} as const

export type StepWithValidation = keyof typeof stepSchemas

export const searchSchema = z
	.object({
		step: z.coerce.number().int().min(1).max(STEP_COUNT).optional(),
		unit: z.enum(UNITS).optional(),
		sex: z.enum(SEXES).optional(),
		age: z.coerce.number().int().optional(),
		weightKg: z.coerce.number().optional(),
		heightCm: z.coerce.number().optional(),
		activity: z.enum(ACTIVITY_LEVELS).optional(),
		goal: z.enum(GOALS).optional(),
		preset: z.enum(DIET_PRESET_VALUES).optional(),
		proteinPerKg: z.coerce.number().optional(),
		fatPct: z.coerce.number().optional(),
	})
	.catch({})

export type SearchValues = z.infer<typeof searchSchema>

export function validateStep(
	step: StepWithValidation,
	values: Partial<FormValues>,
): {ok: true; data: Partial<FormValues>} | {ok: false; issues: z.ZodIssue[]} {
	const result = stepSchemas[step].safeParse(values)
	if (result.success) return {ok: true, data: result.data}
	return {ok: false, issues: result.error.issues}
}

export function searchToFormValues(search: SearchValues): Partial<FormValues> {
	const {step: _step, ...rest} = search
	return rest
}
