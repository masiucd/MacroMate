import type {z} from "zod"
import {ActivityIcon} from "#/components/icons"
import {Heading, Text} from "#/components/typography"
import {cn} from "#/lib/utils"
import type {WizardForm} from "../../routes/calculator/form"
import {FieldInfo} from "../field_info"
import {StepIssues} from "../step_issues"

type FieldProps = {form: WizardForm}

type ActivityOption = {
	value: "sedentary" | "light" | "moderate" | "very" | "extra"
	label: string
	description: string
	multiplier: string
}

const ACTIVITY_OPTIONS: ActivityOption[] = [
	{
		value: "sedentary",
		label: "Sedentary",
		description: "Desk job, little or no exercise",
		multiplier: "× 1.2",
	},
	{
		value: "light",
		label: "Lightly active",
		description: "Light exercise 1–3 days / week",
		multiplier: "× 1.375",
	},
	{
		value: "moderate",
		label: "Moderately active",
		description: "Moderate exercise 3–5 days / week",
		multiplier: "× 1.55",
	},
	{
		value: "very",
		label: "Very active",
		description: "Hard exercise 6–7 days / week",
		multiplier: "× 1.725",
	},
	{
		value: "extra",
		label: "Extra active",
		description: "Physical job + hard daily training",
		multiplier: "× 1.9",
	},
]

export function ActivityLevel({form, issues}: {form: WizardForm; issues: z.core.$ZodIssue[]}) {
	return (
		<div className="flex flex-col gap-5">
			<SectionHeader
				title="Activity level"
				subtitle="How active are you on a typical week? This sets your TDEE multiplier."
			/>
			<StepIssues issues={issues} />
			<div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-5 md:p-6">
				<ActivityField form={form} />
			</div>
		</div>
	)
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function SectionHeader({title, subtitle}: {title: string; subtitle: string}) {
	return (
		<div className="flex items-start gap-3">
			<span className="mt-1 shrink-0 text-lagoon-deep">
				<ActivityIcon size={22} />
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

// ─── Radio cards ──────────────────────────────────────────────────────────────

function RadioCards<T extends string>({
	name,
	value,
	options,
	onChange,
}: {
	name: string
	value: T | undefined
	options: {value: T; label: string; description: string; multiplier: string}[]
	onChange: (next: T) => void
}) {
	return (
		<fieldset className="flex flex-col gap-2">
			{options.map(opt => {
				const selected = opt.value === value
				const id = `${name}-${opt.value}`
				return (
					<label
						key={opt.value}
						htmlFor={id}
						className={cn(
							"flex cursor-pointer items-center justify-between gap-4 rounded-lg border px-4 py-3 transition-colors",
							"has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-lagoon",
							selected
								? "border-lagoon bg-lagoon/5 text-sea-ink"
								: "border-line bg-foam text-sea-ink-soft hover:border-lagoon/50 hover:text-sea-ink",
						)}
					>
						<input
							id={id}
							type="radio"
							name={name}
							value={opt.value}
							checked={selected}
							onChange={() => onChange(opt.value)}
							className="sr-only"
						/>
						<div className="flex flex-col gap-0.5">
							<span
								className={cn(
									"font-medium text-sm",
									selected ? "text-sea-ink" : "text-sea-ink-soft",
								)}
							>
								{opt.label}
							</span>
							<span className="text-sea-ink-soft text-xs">{opt.description}</span>
						</div>
						<span
							className={cn(
								"shrink-0 font-mono text-xs",
								selected ? "font-semibold text-palm" : "text-sea-ink-soft",
							)}
						>
							{opt.multiplier}
						</span>
					</label>
				)
			})}
		</fieldset>
	)
}

// ─── Fields ───────────────────────────────────────────────────────────────────

function ActivityField({form}: FieldProps) {
	return (
		<form.Field
			name="activity"
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
