import type {z} from "zod"
import {StepIssues} from "#/components/step_issues"
import type {CalculatorSearchParams} from "#/routes/calculator/types"
import type {WizardForm} from "../../routes/calculator/form"

interface Props {
	searchParams: CalculatorSearchParams
	form: WizardForm
	issues: z.core.$ZodIssue[]
}

export function Macros({form: _form, issues}: Props) {
	return (
		<div className="flex flex-col gap-2">
			<StepIssues issues={issues} />
			<p>Macros</p>
		</div>
	)
}
