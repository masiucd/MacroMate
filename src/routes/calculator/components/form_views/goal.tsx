import type {z} from "zod"
import type {WizardForm} from "../../form"
import {StepIssues} from "../step_issues"

export function Goal({form: _form, issues}: {form: WizardForm; issues: z.core.$ZodIssue[]}) {
	return (
		<div className="flex flex-col gap-2">
			<StepIssues issues={issues} />
			<p>Goal</p>
		</div>
	)
}
