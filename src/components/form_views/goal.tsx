import type {z} from "zod"
import {GoalIcon} from "#/components/icons"
import {Heading, Text} from "#/components/typography"
import {cn} from "#/lib/utils"
import type {CalculatorSearchParams} from "#/routes/calculator/types"
import type {WizardForm} from "../../routes/calculator/form"
import {FieldInfo} from "../field_info"
import {StepIssues} from "../step_issues"

type FieldProps = {form: WizardForm}

type GoalOption = {
	value: "cut" | "maintain" | "bulk"
	label: string
	description: string
	badge: string
}

const GOAL_OPTIONS: GoalOption[] = [
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

interface Props {
	searchParams: CalculatorSearchParams
	form: WizardForm
	issues: z.core.$ZodIssue[]
}

export function Goal({form, issues, searchParams}: Props) {
	return (
		<div className="flex flex-col gap-5">
			<SectionHeader
				title="Your goal"
				subtitle="What are you working towards? This sets your daily calorie target."
			/>
			<StepIssues issues={issues} />
			<div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-5 md:p-6">
				<GoalField form={form} goal={searchParams.goal} />
			</div>
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

// ─── Radio cards ──────────────────────────────────────────────────────────────

function RadioCards<T extends string>({
	name,
	value,
	options,
	onChange,
}: {
	name: string
	value: T | undefined
	options: {value: T; label: string; description: string; badge: string}[]
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
							{opt.badge}
						</span>
					</label>
				)
			})}
		</fieldset>
	)
}

// ─── Fields ───────────────────────────────────────────────────────────────────

function GoalField({form, goal}: FieldProps & {goal?: GoalOption["value"]}) {
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
