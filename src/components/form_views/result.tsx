import {bmr, kcalForGoal, splitMacros, tdee} from "#/features/calculator/formulas"
import {CheckIcon} from "../icons"
import {type StepProps, StepShell} from "./step_primitives"

// const _requiredParams = [
// 	"goal",
// 	"weightKg",
// 	"heightCm",
// 	"age",
// 	"activity",
// 	"proteinPerKg",
// 	"fatPct",
// 	"sex",
// ] as const

function hasAllRequiredParams(searchParams: StepProps["searchParams"]): boolean {
	if (
		searchParams.goal ||
		searchParams.weightKg ||
		searchParams.heightCm ||
		searchParams.age ||
		searchParams.activity ||
		searchParams.proteinPerKg ||
		searchParams.fatPct ||
		searchParams.sex
	) {
		return true
	}
	return false
}

export function Result({issues, searchParams}: Pick<StepProps, "issues" | "searchParams">) {
	if (issues) {
		console.log("Validation issues:", issues)
	}

	// TOOD : handle the case where the user has not provided all required inputs
	// Make the if statement more robust to check for all required inputs and display a message if any are missing
	if (
		// !searchParams.goal ||
		// !searchParams.weightKg ||
		// !searchParams.heightCm ||
		// !searchParams.age ||
		// !searchParams.activity ||
		// !searchParams.proteinPerKg ||
		// !searchParams.fatPct ||
		// !searchParams.sex
		!hasAllRequiredParams(searchParams)
	) {
		return <div>Please provide weight, height, and age to calculate results.</div>
	}

	const bmrValue = bmr({
		sex: searchParams.sex,
		weightKg: searchParams.weightKg,
		heightCm: searchParams.heightCm,
		age: searchParams.age,
	})

	const tdeeVal = tdee(bmrValue, searchParams.activity)
	const kcal = kcalForGoal(tdeeVal, searchParams.goal)
	const macros = splitMacros({
		kcal,
		weightKg: searchParams.weightKg,
		proteinPerKg: searchParams.proteinPerKg,
		fatPct: searchParams.fatPct,
	})

	return (
		<StepShell
			icon={<CheckIcon size={22} />}
			title="Final results"
			subtitle="Here are your calculated daily targets based on the information you provided."
			issues={issues}
		>
			<pre>{JSON.stringify({bmr: bmrValue, tdee: tdeeVal, kcal, macros}, null, 2)}</pre>
		</StepShell>
	)
}

// asdasda
