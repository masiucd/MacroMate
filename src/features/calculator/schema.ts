import {z} from "zod"
import {BOUNDS} from "./formulas"

/** Supported unit systems for weight and height input. */
export const UNITS = ["metric", "imperial"] as const
/** "metric" | "imperial" */
export type Unit = (typeof UNITS)[number]

/** Biological sexes used for BMR calculation. */
export const SEXES = ["male", "female"] as const
/** Physical activity levels mapped to TDEE multipliers. */
export const ACTIVITY_LEVELS = ["sedentary", "light", "moderate", "very", "extra"] as const
/** Caloric goal: caloric deficit, maintenance, or surplus. */
export const GOALS = ["cut", "maintain", "bulk"] as const
/** Named macro distribution presets, plus "custom" for manual override. */
export const DIET_PRESET_VALUES = [
	"balanced",
	"high-protein",
	"low-carb",
	"keto",
	"custom",
] as const

/** Total number of wizard steps in the calculator form. */
export const STEP_COUNT = 5
/** Tuple of all valid step numbers. */
export const STEPS = [1, 2, 3, 4, 5] as const
/** A single wizard step number (1–5). */
export type Step = (typeof STEPS)[number]

/** Allowed range for protein intake in grams per kilogram of body weight. */
export const PROTEIN_PER_KG_BOUNDS = {min: 0.5, max: 4} as const
/** Allowed range for fat as a fraction of total daily calories (10 %–85 %). */
export const FAT_PCT_BOUNDS = {min: 0.1, max: 0.85} as const

/**
 * Full Zod schema for the calculator form.
 * All numeric bounds are sourced from {@link BOUNDS} (formula constants)
 * and the local bound constants above.
 */
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

/** Fully validated form values inferred from {@link formSchema}. */
export type FormValues = z.infer<typeof formSchema>

/** Step 1 – personal details: unit system, sex, age, weight, and height. */
export const personalStepSchema = formSchema.pick({
	unit: true,
	sex: true,
	age: true,
	weightKg: true,
	heightCm: true,
})

/** Step 2 – physical activity level. */
export const activityStepSchema = formSchema.pick({activity: true})
/** Step 3 – caloric goal (cut / maintain / bulk). */
export const goalStepSchema = formSchema.pick({goal: true})
/** Step 4 – macro distribution: preset, protein target, and fat percentage. */
export const macrosStepSchema = formSchema.pick({
	preset: true,
	proteinPerKg: true,
	fatPct: true,
})

/**
 * Map of wizard step number to its corresponding partial Zod schema.
 * Step 5 (results) has no user input and is therefore excluded.
 */
export const stepSchemas = {
	1: personalStepSchema,
	2: activityStepSchema,
	3: goalStepSchema,
	4: macrosStepSchema,
} as const

/** Step numbers that have an associated validation schema (1–4). */
export type StepWithValidation = keyof typeof stepSchemas

/**
 * Zod schema for URL search-param persistence of form state.
 * All fields are optional and use `z.coerce` for numeric params so they
 * survive the string-only URL encoding. Falls back to an empty object on
 * any parse failure (`.catch({})`).
 */
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

/** Values parsed from the URL search params, all fields optional. */
export type SearchValues = z.infer<typeof searchSchema>

/**
 * Validates a subset of form values against the schema for the given step.
 *
 * @param step - The wizard step to validate (must have an associated schema).
 * @param values - Partial form values, typically the current store state.
 * @returns `{ok: true, data}` on success or `{ok: false, issues}` on failure.
 */
export function validateStep(
	step: StepWithValidation,
	values: Partial<FormValues>,
): {ok: true; data: Partial<FormValues>} | {ok: false; issues: z.ZodIssue[]} {
	const result = stepSchemas[step].safeParse(values)
	if (result.success) return {ok: true, data: result.data}
	return {ok: false, issues: result.error.issues}
}

/**
 * Strips the navigation-only `step` key from parsed search params and
 * returns the remainder as a partial set of form values.
 *
 * @param search - Validated search-param values.
 * @returns Form values suitable for seeding the calculator store.
 */
export function searchToFormValues(search: SearchValues): Partial<FormValues> {
	const {step: _step, ...rest} = search
	return rest
}
