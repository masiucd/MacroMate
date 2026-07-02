import {CheckIcon} from "lucide-react"
import {type StepProps, StepShell} from "./step_primitives"

export function Result({form, issues, searchParams}: StepProps) {
	if (issues) {
		console.log("Validation issues:", issues)
	}
	console.log(form, searchParams)

	return (
		<StepShell
			icon={<CheckIcon size={22} />}
			title="Final results"
			subtitle="Here are your calculated daily targets based on the information you provided."
			issues={issues}
		>
			{/*<GoalField form={form} goal={searchParams.goal} />*/}
			<p>
				Here will be the final results based on the user's input. You can display the calculated
				macros, calories, and other relevant information here.
			</p>
		</StepShell>
	)
}

// asdasda
