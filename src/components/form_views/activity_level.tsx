import {FieldInfo} from "#/components/field_info"
import {ActivityIcon} from "#/components/icons"
import {
	type FieldProps,
	type RadioCardOption,
	RadioCards,
	type StepProps,
	StepShell,
} from "./step_primitives"

type ActivityValue = "sedentary" | "light" | "moderate" | "very" | "extra"

const ACTIVITY_OPTIONS: RadioCardOption<ActivityValue>[] = [
	{
		value: "sedentary",
		label: "Sedentary",
		description: "Desk job, little or no exercise",
		badge: "× 1.2",
	},
	{
		value: "light",
		label: "Lightly active",
		description: "Light exercise 1–3 days / week",
		badge: "× 1.375",
	},
	{
		value: "moderate",
		label: "Moderately active",
		description: "Moderate exercise 3–5 days / week",
		badge: "× 1.55",
	},
	{
		value: "very",
		label: "Very active",
		description: "Hard exercise 6–7 days / week",
		badge: "× 1.725",
	},
	{
		value: "extra",
		label: "Extra active",
		description: "Physical job + hard daily training",
		badge: "× 1.9",
	},
]

export function ActivityLevel({form, issues, searchParams}: StepProps) {
	return (
		<StepShell
			icon={<ActivityIcon size={22} />}
			title="Activity level"
			subtitle="How active are you on a typical week? This sets your TDEE multiplier."
			issues={issues}
		>
			<ActivityField form={form} activity={searchParams.activity} />
		</StepShell>
	)
}

function ActivityField({form, activity}: FieldProps & {activity?: ActivityValue}) {
	return (
		<form.Field
			name="activity"
			defaultValue={activity}
			children={field => (
				<>
					<RadioCards
						name={field.name}
						value={field.state.value}
						options={ACTIVITY_OPTIONS}
						onChange={v => field.handleChange(v)}
					/>
					<FieldInfo field={field} />
				</>
			)}
		/>
	)
}
