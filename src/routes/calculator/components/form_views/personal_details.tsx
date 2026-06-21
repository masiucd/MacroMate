import type {z} from "zod"
import {StatsIcon} from "#/components/icons"
import {Heading, Text} from "#/components/typography"
import {Input} from "#/components/ui/input"
import {Label} from "#/components/ui/label"
import {cn} from "#/lib/utils"
import type {WizardForm} from "../../form"
import {FieldInfo} from "../field_info"
import {StepIssues} from "../step_issues"

type FieldProps = {form: WizardForm}

export function PersonalDetails({form, issues}: {form: WizardForm; issues: z.core.$ZodIssue[]}) {
	return (
		<div className="flex flex-col gap-5">
			<SectionHeader
				title="Your stats"
				subtitle="A few numbers so we can dial in your daily targets."
			/>
			<StepIssues issues={issues} />
			<div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-5 md:p-6">
				<UnitField form={form} />
				<Divider />
				<SexField form={form} />
				<Divider />
				<div className="grid gap-5 md:max-w-2xl md:grid-cols-3">
					<AgeField form={form} />
					<WeightField form={form} />
					<HeightField form={form} />
				</div>
			</div>
		</div>
	)
}

// ─── Layout helpers ────────────────────────────────────────────────────────────

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

function Divider() {
	return <div className="h-px w-full bg-line/60" />
}

function FieldShell({
	label,
	htmlFor,
	hint,
	children,
}: {
	label: string
	htmlFor?: string
	hint?: string
	children: React.ReactNode
}) {
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

// ─── Segmented control ────────────────────────────────────────────────────────

type SegmentedOption<T extends string> = {value: T; label: string; hint?: string}

function Segmented<T extends string>({
	name,
	value,
	options,
	onChange,
}: {
	name: string
	value: T | undefined
	options: SegmentedOption<T>[]
	onChange: (next: T) => void
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

function UnitField({form}: FieldProps) {
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
					/>
					<FieldInfo field={field} />
				</FieldShell>
			)}
		/>
	)
}

function SexField({form}: FieldProps) {
	return (
		<form.Field
			name="sex"
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

function NumberField({
	id,
	value,
	onChange,
	onBlur,
	placeholder,
	suffix,
	inputMode = "numeric",
}: {
	id: string
	value: number | undefined
	onChange: (next: number | undefined) => void
	onBlur: () => void
	placeholder: string
	suffix?: string
	inputMode?: "numeric" | "decimal"
}) {
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
			/>
			{suffix ? (
				<span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-sea-ink-soft text-xs">
					{suffix}
				</span>
			) : null}
		</div>
	)
}

function AgeField({form}: FieldProps) {
	return (
		<form.Field
			name="age"
			validators={{
				onBlur: ({value}) => (value === undefined ? "Age is required" : undefined),
			}}
			children={field => (
				<FieldShell label="Age" htmlFor={field.name}>
					<NumberField
						id={field.name}
						value={field.state.value}
						onChange={field.handleChange}
						onBlur={field.handleBlur}
						placeholder="e.g. 32"
						suffix="years"
					/>
					<FieldInfo field={field} />
				</FieldShell>
			)}
		/>
	)
}

function WeightField({form}: FieldProps) {
	const unit = form.getFieldValue("unit") === "metric" ? "kg" : "lb"
	return (
		<form.Field
			name="weightKg"
			validators={{
				onBlur: ({value}) => (value === undefined ? "Weight is required" : undefined),
			}}
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
					/>
					<FieldInfo field={field} />
				</FieldShell>
			)}
		/>
	)
}

function HeightField({form}: FieldProps) {
	return (
		<form.Field
			name="heightCm"
			validators={{
				onBlur: ({value}) => (value === undefined ? "Height is required" : undefined),
			}}
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
					/>
					<FieldInfo field={field} />
				</FieldShell>
			)}
		/>
	)
}
