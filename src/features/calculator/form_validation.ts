// TODO: We need to implement validation for each form and only allow going to the next step if the current form is valid
// Validation functions need to return a boolean indicating whether the form is valid or not

/**
 * Checks that all personal-details fields are non-empty strings.
 *
 * This is a lightweight presence check used to gate step navigation. It does
 * not validate numeric bounds or enum membership — use {@link validateStep}
 * from `schema.ts` for full Zod-based validation.
 *
 * @param fields - The personal-details fields collected from the form.
 * @param fields.unit - Selected unit system (e.g. "metric" or "imperial").
 * @param fields.age - Age entered as a string (e.g. "30").
 * @param fields.weightKg - Weight entered as a string (e.g. "80").
 * @param fields.heightCm - Height entered as a string (e.g. "175").
 * @returns `true` when every string field has at least one non-whitespace character.
 */
export function personalDetailsFormIsValid(fields: {
	unit: string
	// sex: "male" | "female"
	age: string
	weightKg: string
	heightCm: string
}) {
	return Object.values(fields).every(value => {
		if (typeof value === "string") {
			return value.trim() !== ""
		}
		return true
	})
}

/**
 * Checks that an activity level has been selected.
 *
 * @param fields - Object containing the selected activity level.
 * @param fields.activity - The activity level string (e.g. "sedentary", "light").
 * @returns `true` when `activity` is a non-empty, non-whitespace string.
 */
export function activityLevelFormIsValid(fields: {activity: string}) {
	return fields.activity.trim() !== ""
}

/**
 * Checks that a caloric goal is one of the accepted values.
 *
 * The TypeScript signature already constrains the argument to the union type,
 * but the runtime guard keeps this function safe against untyped call sites
 * and future refactors.
 *
 * @param field - The selected goal: `"cut"`, `"maintain"`, or `"bulk"`.
 * @returns `true` when `field` is non-empty and is one of the three valid goals.
 */
export function goalFormIsValid(field: "cut" | "maintain" | "bulk") {
	return field.trim() !== "" && ["cut", "maintain", "bulk"].includes(field)
}

// TODO: Add unit tests for validation functions
