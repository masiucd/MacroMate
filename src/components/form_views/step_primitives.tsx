import type {PropsWithChildren, ReactNode} from "react"
import type {z} from "zod"
import {StepIssues} from "#/components/step_issues"
import {Heading, Text} from "#/components/typography"
import type {WizardForm} from "#/features/calculator/form"
import type {CalculatorSearchParams} from "#/features/calculator/types"
import {cn} from "#/lib/utils"

/** Props shared by all field sub-components that need direct form access. */
export interface FieldProps {
	form: WizardForm
}

/** Props shared by every top-level wizard step view. */
export interface StepProps {
	searchParams: CalculatorSearchParams
	form: WizardForm
	issues: z.core.$ZodIssue[]
}

/**
 * Standard chrome for a wizard step: an icon'd section header, the step-level
 * validation issues, and a bordered surface card wrapping the fields.
 * Pass the step's fields as `children`.
 */
export function StepShell({
	icon,
	title,
	subtitle,
	issues,
	children,
}: PropsWithChildren<{
	icon: ReactNode
	title: string
	subtitle: string
	issues: z.core.$ZodIssue[]
}>) {
	return (
		<div className="flex flex-col gap-5">
			<SectionHeader icon={icon} title={title} subtitle={subtitle} />
			<StepIssues issues={issues} />
			<div className="flex flex-col gap-6">{children}</div>
		</div>
	)
}

/** Renders a labelled section header with an icon, title, and subtitle. */
function SectionHeader({
	icon,
	title,
	subtitle,
}: {
	icon: ReactNode
	title: string
	subtitle: string
}) {
	return (
		<div className="flex items-start gap-3">
			<span className="mt-1 shrink-0 text-lagoon-deep">{icon}</span>
			<div className="flex flex-col gap-1">
				<Heading as="h3" size="h3">
					{title}
				</Heading>
				<Text variant="muted">{subtitle}</Text>
			</div>
		</div>
	)
}

/** Full-width horizontal rule used to visually separate form sections. */
export function Divider() {
	return <div className="h-px w-full bg-line/60" />
}

/** A single option rendered inside `RadioCards`. */
export type RadioCardOption<T extends string> = {
	value: T
	label: string
	description: string
	badge: string
}

/**
 * Vertical stack of selectable cards backed by a visually hidden radio group,
 * preserving full keyboard and screen-reader accessibility. Each card shows a
 * label, description, and a right-aligned `badge` (e.g. a calorie delta or
 * activity multiplier).
 */
export function RadioCards<T extends string>({
	name,
	value,
	options,
	onChange,
}: {
	name: string
	value: T | undefined
	options: RadioCardOption<T>[]
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
