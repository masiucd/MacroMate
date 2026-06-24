import type {PropsWithChildren} from "react"
import type {z} from "zod"
import {FieldInfo} from "#/components/field_info"
import {StatsIcon} from "#/components/icons"
import {StepIssues} from "#/components/step_issues"
import {Heading, Text} from "#/components/typography"
import {Input} from "#/components/ui/input"
import {Label} from "#/components/ui/label"
import {cn} from "#/lib/utils"
import type {CalculatorSearchParams} from "#/routes/calculator/types"
import type {WizardForm} from "../../routes/calculator/form"

/** Props shared by all field sub-components that need direct form access. */
interface FieldProps {
	form: WizardForm
}

/** Props for the top-level PersonalDetails step. */
interface Props {
	searchParams: CalculatorSearchParams
	form: WizardForm
	issues: z.core.$ZodIssue[]
}

/**
 * Step 1 of the calculator wizard — collects unit system, sex, age, weight,
 * and height. Validation errors for the whole step are surfaced via
 * `StepIssues`.
 */
export function PersonalDetails({form, issues, searchParams}: Props) {
	return (
		<div className="flex flex-col gap-5">
			<SectionHeader
				title="Your stats"
				subtitle="A few numbers so we can dial in your daily targets."
			/>

			<div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-5 md:p-6">
				<UnitField form={form} unit={searchParams.unit} />
				<Divider />
				<SexField form={form} sex={searchParams.sex} />
				<Divider />
				<div className="grid gap-5 md:max-w-2xl md:grid-cols-3">
					<AgeField form={form} age={searchParams.age} />
					<WeightField form={form} weightKg={searchParams.weightKg} />
					<HeightField form={form} heightCm={searchParams.heightCm} />
				</div>
				<StepIssues issues={issues} />
			</div>
		</div>
	)
}

// ─── Layout helpers ────────────────────────────────────────────────────────────

/** Renders a labelled section header with an icon, title, and subtitle. */
function SectionHeader({title, subtitle}: {title: string; subtitle: string}) {
	return (
		<div className="flex items-start gap-3">
			<span className="mt-1 shrink-0 text-lagoon-deep">
				<StatsIcon size={22} />
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

/** Full-width horizontal rule used to visually separate form sections. */
function Divider() {
	return <div className="h-px w-full bg-line/60" />
}

/** Props for `FieldShell`, extracted for use with `PropsWithChildren`. */
interface FieldShellProps {
	label: string
	htmlFor?: string
	hint?: string
}

/**
 * Wraps a form control with a `<Label>` and an optional inline hint.
 * Pass `htmlFor` to associate the label with the control's `id`.
 */
function FieldShell({label, htmlFor, hint, children}: PropsWithChildren<FieldShellProps>) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex items-baseline justify-between gap-2">
				<Label htmlFor={htmlFor}>{label}</Label>
				{hint ? (
					<Text variant="muted" as="span" className="text-xs">
						{hint}
					</Text>
				) : null}
			</div>
			{children}
		</div>
	)
}

/** A single option rendered inside `Segmented`. */
type SegmentedOption<T extends string> = {value: T; label: string; hint?: string}

/**
 * Pill-style radio group that renders a set of mutually exclusive options.
 * Each option is a styled `<label>` wrapping a visually hidden `<input type="radio">`
 * to preserve full keyboard and screen-reader accessibility.
 */
function Segmented<T extends string>({
	name,
	value,
	options,
	onChange,
	defaultValue,
}: {
	name: string
	value: T | undefined
	options: SegmentedOption<T>[]
	onChange: (next: T) => void
	defaultValue?: T
}) {
	return (
		<fieldset className="inline-flex w-full max-w-md rounded-lg border border-line bg-foam p-1">
			{options.map(opt => {
				const selected = opt.value === value
				const id = `${name}-${opt.value}`
				return (
					<label
						key={opt.value}
						htmlFor={id}
						className={cn(
							"flex flex-1 cursor-pointer flex-col items-center gap-0.5 rounded-md px-3 py-2 text-sm transition-colors",
							"has-[input:focus-visible]:ring-2 has-[input:focus-visible]:ring-lagoon",
							selected
								? "bg-surface-strong font-semibold text-sea-ink shadow-sm"
								: "text-sea-ink-soft hover:text-sea-ink",
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
							defaultValue={defaultValue}
						/>
						<span>{opt.label}</span>
						{opt.hint ? <span className="text-[11px] text-sea-ink-soft">{opt.hint}</span> : null}
					</label>
				)
			})}
		</fieldset>
	)
}

// ─── Fields ───────────────────────────────────────────────────────────────────

/**
 * Lets the user choose between "metric" (kg/cm) and "imperial" (lb/in).
 * Selection is required; an inline error is shown if the field is left empty.
 * `unit` from search params is used as the initial default value.
 */
function UnitField({form, unit}: FieldProps & {unit?: "metric" | "imperial"}) {
	return (
		<form.Field
			name="unit"
			validators={{onChange: ({value}) => (value ? undefined : "Unit is required")}}
			children={field => (
				<FieldShell label="Unit system" htmlFor={field.name}>
					<Segmented
						name={field.name}
						value={field.state.value}
						onChange={v => field.handleChange(v)}
						options={[
							{value: "metric", label: "Metric", hint: "kg · cm"},
							{value: "imperial", label: "Imperial", hint: "lb · in"},
						]}
						defaultValue={unit}
					/>
					<FieldInfo field={field} />
				</FieldShell>
			)}
		/>
	)
}

/**
 * Biological sex selector (female / male) used as an input to the
 * Mifflin–St Jeor BMR formula. The hint text makes the purpose explicit to
 * the user without cluttering the label.
 */
function SexField({form, sex}: FieldProps & {sex?: "female" | "male"}) {
	return (
		<form.Field
			name="sex"
			defaultValue={sex}
			children={field => (
				<FieldShell label="Sex" htmlFor={field.name} hint="Used for BMR calculation">
					<Segmented
						name={field.name}
						value={field.state.value}
						onChange={v => field.handleChange(v)}
						options={[
							{value: "female", label: "Female"},
							{value: "male", label: "Male"},
						]}
					/>
					<FieldInfo field={field} />
				</FieldShell>
			)}
		/>
	)
}

/** Props for `NumberField`. */
interface NumberFieldProps {
	id: string
	value: number | undefined
	onChange: (next: number | undefined) => void
	onBlur: () => void
	placeholder: string
	suffix?: string
	inputMode?: "numeric" | "decimal"
	defaultValue?: string
}

/**
 * Generic numeric `<Input>` with an optional absolute-positioned unit suffix
 * (e.g. "kg", "cm", "years"). Converts the raw string value from the DOM
 * event to `number | undefined` so consumers stay type-safe.
 *
 * `inputMode` defaults to `"numeric"` but should be set to `"decimal"` for
 * fields that accept fractional values (weight, height).
 */
function NumberField({
	id,
	value,
	onChange,
	onBlur,
	placeholder,
	suffix,
	inputMode = "numeric",
	defaultValue = "",
}: NumberFieldProps) {
	return (
		<div className="relative">
			<Input
				id={id}
				type="number"
				inputMode={inputMode}
				placeholder={placeholder}
				value={value ?? ""}
				onBlur={onBlur}
				onChange={e => {
					const v = e.target.value
					onChange(v === "" ? undefined : Number(v))
				}}
				className={suffix ? "pr-12" : undefined}
				defaultValue={defaultValue}
			/>
			{suffix ? (
				<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sea-ink-soft text-xs">
					{suffix}
				</span>
			) : null}
		</div>
	)
}

/** Age input (whole years). Validated on blur — must not be empty. Pre-filled from search params. */
function AgeField({form, age}: FieldProps & {age?: number}) {
	return (
		<form.Field
			name="age"
			validators={{
				onBlur: ({value}) => (value === undefined ? "Age is required" : undefined),
			}}
			defaultValue={age}
			children={field => (
				<FieldShell label="Age" htmlFor={field.name}>
					<NumberField
						id={field.name}
						value={field.state.value}
						onChange={field.handleChange}
						onBlur={field.handleBlur}
						placeholder="e.g. 32"
						suffix="years"
						defaultValue={age?.toString()}
					/>
					<FieldInfo field={field} />
				</FieldShell>
			)}
		/>
	)
}

/**
 * Weight input. The suffix and placeholder adapt to the currently selected
 * unit system ("kg" for metric, "lb" for imperial). Uses `inputMode="decimal"`
 * to allow fractional values on mobile keyboards.
 */
function WeightField({form, weightKg}: FieldProps & {weightKg?: number}) {
	const unit = form.getFieldValue("unit") === "metric" ? "kg" : "lb"
	return (
		<form.Field
			name="weightKg"
			validators={{
				onBlur: ({value}) => (value === undefined ? "Weight is required" : undefined),
			}}
			defaultValue={weightKg}
			children={field => (
				<FieldShell label="Weight" htmlFor={field.name}>
					<NumberField
						id={field.name}
						value={field.state.value}
						onChange={field.handleChange}
						onBlur={field.handleBlur}
						placeholder={unit === "kg" ? "e.g. 72" : "e.g. 160"}
						suffix={unit}
						inputMode="decimal"
						defaultValue={weightKg?.toString()}
					/>
					<FieldInfo field={field} />
				</FieldShell>
			)}
		/>
	)
}

/**
 * Height input (stored internally in cm regardless of the display unit).
 * Uses `inputMode="decimal"` to allow fractional values on mobile keyboards.
 */
function HeightField({form, heightCm}: FieldProps & {heightCm?: number}) {
	return (
		<form.Field
			name="heightCm"
			validators={{
				onBlur: ({value}) => (value === undefined ? "Height is required" : undefined),
			}}
			defaultValue={heightCm}
			children={field => (
				<FieldShell label="Height" htmlFor={field.name}>
					<NumberField
						id={field.name}
						value={field.state.value}
						onChange={field.handleChange}
						onBlur={field.handleBlur}
						placeholder="e.g. 178"
						suffix="cm"
						inputMode="decimal"
						defaultValue={heightCm?.toString()}
					/>
					<FieldInfo field={field} />
				</FieldShell>
			)}
		/>
	)
}
