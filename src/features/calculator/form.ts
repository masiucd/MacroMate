import {formOptions, useForm} from "@tanstack/react-form"
import type {
	ACTIVITY_LEVELS,
	DIET_PRESET_VALUES,
	GOALS,
	SEXES,
	UNITS,
} from "#/features/calculator/schema"

export type WizardFormValues = {
	unit: (typeof UNITS)[number]
	sex: (typeof SEXES)[number]
	age: number | undefined
	weightKg: number | undefined
	heightCm: number | undefined
	activity: (typeof ACTIVITY_LEVELS)[number] | undefined
	goal: (typeof GOALS)[number] | undefined
	preset: (typeof DIET_PRESET_VALUES)[number]
	proteinPerKg: number
	fatPct: number
}

const defaultValues: WizardFormValues = {
	unit: "metric",
	sex: "female",
	age: undefined,
	weightKg: undefined,
	heightCm: undefined,
	// ...personalDetailValues,
	activity: undefined,
	goal: undefined,
	preset: "balanced",
	proteinPerKg: 1.6,
	fatPct: 0.3,
}

export const formOpts = formOptions({defaultValues})

export function useWizardForm(
	initialValues?: Partial<WizardFormValues>,
	onSubmit?: (values: WizardFormValues) => void,
) {
	console.log("Initial values", initialValues)

	const mergedDefaults: WizardFormValues = initialValues
		? ({
				...defaultValues,
				...Object.fromEntries(Object.entries(initialValues).filter(([, v]) => v !== undefined)),
			} as WizardFormValues)
		: defaultValues

	return useForm({
		defaultValues: mergedDefaults,
		onSubmit: ({value}) => {
			// TODO: wire to results step
			console.log("Value", value)
			if (onSubmit && typeof onSubmit === "function") {
				onSubmit(value)
			}
			// calcualte macros and make sure the users end up on the result view
		},
	})
}

export type WizardForm = ReturnType<typeof useWizardForm>
