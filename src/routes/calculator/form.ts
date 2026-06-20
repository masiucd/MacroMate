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

// export const personalDetailValues: Pick<
// 	WizardFormValues,
// 	"unit" | "sex" | "age" | "weightKg" | "heightCm"
// > = {
// 	unit: "metric",
// 	sex: "female",
// 	age: undefined,
// 	weightKg: undefined,
// 	heightCm: undefined,
// }

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

export function useWizardForm() {
	return useForm({
		...formOpts,
		onSubmit: ({value}) => {
			// TODO: wire to results step
			console.log("Value", value)
		},
	})
}

export type WizardForm = ReturnType<typeof useWizardForm>
