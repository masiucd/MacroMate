import type {z} from "zod"
import {StepIssues} from "#/components/step_issues"
import type {CalculatorSearchParams} from "#/routes/calculator/types"
import type {WizardForm} from "../../routes/calculator/form"
import {GoalIcon} from "../icons"
import {Heading, Text} from "../typography"

interface Props {
	searchParams: CalculatorSearchParams
	form: WizardForm
	issues: z.core.$ZodIssue[]
}

export function Goal({form: _form, issues}: Props) {
	return (
		<div className="flex flex-col gap-2">
			<SectionHeader title="Goal" subtitle="What is your goal?" />
			<StepIssues issues={issues} />
			<p>Goal</p>
		</div>
	)
}

// ─── Layout helpers ───────────────────────────────────────────────────────────
function SectionHeader({title, subtitle}: {title: string; subtitle: string}) {
	return (
		<div className="flex items-start gap-3">
			<span className="mt-1 shrink-0 text-lagoon-deep">
				<GoalIcon size={22} />
			</span>
			<div className="flex flex-col gap-1">
				<Heading as="h3" size="h3">
					{title}
				</Heading>
				<Text variant="muted">{subtitle}</Text>
			</div>
		</div>
	)
}
