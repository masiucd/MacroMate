import {FieldInfo} from "#/components/field_info"
import {GoalIcon} from "#/components/icons"
import {
	type FieldProps,
	type RadioCardOption,
	RadioCards,
	type StepProps,
	StepShell,
} from "./step_primitives"

type GoalValue = "cut" | "maintain" | "bulk"

const GOAL_OPTIONS: RadioCardOption<GoalValue>[] = [
	{
		value: "cut",
		label: "Cut",
		description: "Lose body fat while preserving muscle",
		badge: "−250–500 kcal",
	},
	{
		value: "maintain",
		label: "Maintain",
		description: "Keep your current weight and body composition",
		badge: "± 0 kcal",
	},
	{
		value: "bulk",
		label: "Bulk",
		description: "Build muscle and gain weight in a controlled surplus",
		badge: "+250–500 kcal",
	},
]

export function Goal({form, issues, searchParams}: StepProps) {
	return (
		<StepShell
			icon={<GoalIcon size={22} />}
			title="Your goal"
			subtitle="What are you working towards? This sets your daily calorie target."
			issues={issues}
		>
			<GoalField form={form} goal={searchParams.goal} />
		</StepShell>
	)
}

function GoalField({form, goal}: FieldProps & {goal?: GoalValue}) {
	return (
		<form.Field
			name="goal"
			defaultValue={goal}
			children={field => (
				<>
					<RadioCards
						name={field.name}
						value={field.state.value}
						options={GOAL_OPTIONS}
						onChange={v => field.handleChange(v)}
					/>
					<FieldInfo field={field} />
				</>
			)}
		/>
	)
}
