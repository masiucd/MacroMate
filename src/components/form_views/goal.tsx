import type {z} from "zod"
import {StepIssues} from "#/components/step_issues"
import type {WizardForm} from "../../routes/calculator/form"

export function Goal({form: _form, issues}: {form: WizardForm; issues: z.core.$ZodIssue[]}) {
	return (
		<div className="flex flex-col gap-2">
			<StepIssues issues={issues} />
			<p>Goal</p>
		</div>
	)
}
