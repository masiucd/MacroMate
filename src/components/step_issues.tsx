import type {z} from "zod"
import {AlertIcon} from "#/components/icons"
import {Text} from "#/components/typography"
import {cn} from "#/lib/utils"

type FieldMeta = {
	label: string
	unit?: string
	formatBound?: (value: number) => string
}

const FIELDS: Record<string, FieldMeta> = {
	unit: {label: "unit system"},
	sex: {label: "sex"},
	age: {label: "age", unit: "years"},
	weightKg: {label: "weight", unit: "kg"},
	heightCm: {label: "height", unit: "cm"},
	activity: {label: "activity level"},
	goal: {label: "goal"},
	preset: {label: "diet preset"},
	proteinPerKg: {label: "protein per kg", unit: "g/kg"},
	fatPct: {
		label: "fat percentage",
		formatBound: value => `${Math.round(value * 100)}%`,
	},
}

function capitalize(text: string): string {
	return text.charAt(0).toUpperCase() + text.slice(1)
}

function fieldFor(issue: z.core.$ZodIssue): FieldMeta {
	const key = issue.path[0]
	if (typeof key === "string" && FIELDS[key]) return FIELDS[key]
	return {label: typeof key === "string" ? key : "this field"}
}

function formatBoundValue(field: FieldMeta, value: number): string {
	const formatted = field.formatBound ? field.formatBound(value) : String(value)
	return field.unit && !field.formatBound ? `${formatted} ${field.unit}` : formatted
}

function messageFor(issue: z.core.$ZodIssue): string {
	const field = fieldFor(issue)

	switch (issue.code) {
		case "invalid_type": {
			const received = "received" in issue ? issue.received : undefined
			if (received === "undefined") return `Please enter your ${field.label}.`
			return `Please enter a valid value for ${field.label}.`
		}
		case "too_small":
			return `${capitalize(field.label)} must be at least ${formatBoundValue(field, Number(issue.minimum))}.`
		case "too_big":
			return `${capitalize(field.label)} must be at most ${formatBoundValue(field, Number(issue.maximum))}.`
		case "invalid_value":
			return `Please choose a ${field.label}.`
		default:
			return `Please review your ${field.label}.`
	}
}

interface Props {
	issues: z.core.$ZodIssue[]
	className?: string
}

export function StepIssues({issues, className}: Props) {
	const hasIssues = issues.length > 0

	const seen = new Set<string>()
	const messages: {key: string; text: string}[] = []
	for (const issue of issues) {
		const key = issue.path.join(".") || "_root"
		if (seen.has(key)) continue
		seen.add(key)
		messages.push({key, text: messageFor(issue)})
	}

	return (
		<output
			aria-live="polite"
			className={cn(
				"flex min-h-20 flex-col gap-3 overflow-hidden rounded-md border p-3",
				"transition-[height,background-color,border-color] duration-200 ease-out",
				"motion-reduce:transition-none",
				hasIssues ? "border-warning/40 bg-warning/10" : "bg-green-400/10",
				className,
			)}
		>
			<div className="flex h-10 items-center gap-2">
				<span className={cn("mt-0.5 shrink-0 text-warning", !hasIssues && "text-green-foreground")}>
					<AlertIcon size={18} />
				</span>
				{hasIssues ? (
					<Text variant="small" className="text-warning-foreground">
						Finish this step to continue
					</Text>
				) : (
					<Text variant="small" className="text-green-foreground">
						All good! You can continue to the next step.
					</Text>
				)}
			</div>
			<ul className="flex flex-col gap-0.5">
				{messages.map(m => (
					<li key={m.key}>
						<Text variant="muted" as="span">
							{m.text}
						</Text>
					</li>
				))}
			</ul>
		</output>
	)
}
