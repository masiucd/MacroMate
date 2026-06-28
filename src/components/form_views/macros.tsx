import {useStore} from "@tanstack/react-form"
import type {z} from "zod"
import {FieldInfo} from "#/components/field_info"
import {DietIcon} from "#/components/icons"
import {StepIssues} from "#/components/step_issues"
import {Heading, Text} from "#/components/typography"
import {Label} from "#/components/ui/label"
import {Slider} from "#/components/ui/slider"
import {DIET_PRESETS} from "#/features/calculator/formulas"
import {
	type DIET_PRESET_VALUES,
	FAT_PCT_BOUNDS,
	PROTEIN_PER_KG_BOUNDS,
} from "#/features/calculator/schema"
import {cn} from "#/lib/utils"
import type {CalculatorSearchParams} from "#/routes/calculator/types"
import type {WizardForm} from "../../routes/calculator/form"

type FieldProps = {form: WizardForm}

type PresetOption = {
	value: (typeof DIET_PRESET_VALUES)[number]
	label: string
	description: string
	badge: string
}

const PRESET_OPTIONS: PresetOption[] = [
	{
		value: "balanced",
		label: "Balanced",
		description: "A well-rounded mix of protein, carbs, and fat",
		badge: "1.6 g/kg · 30% fat",
	},
	{
		value: "high-protein",
		label: "High Protein",
		description: "Optimised for muscle retention and satiety",
		badge: "2.2 g/kg · 25% fat",
	},
	{
		value: "low-carb",
		label: "Low Carb",
		description: "Reduced carbs with moderate fat intake",
		badge: "1.8 g/kg · 50% fat",
	},
	{
		value: "keto",
		label: "Keto",
		description: "Very low carbs, high fat for ketosis",
		badge: "1.8 g/kg · 70% fat",
	},
	{
		value: "custom",
		label: "Custom",
		description: "Set your own protein and fat targets manually",
		badge: "Manual",
	},
]

interface Props {
	searchParams: CalculatorSearchParams
	form: WizardForm
	issues: z.core.$ZodIssue[]
}

export function Macros({form, issues, searchParams}: Props) {
	return (
		<div className="flex flex-col gap-5">
			<SectionHeader
				title="Macro distribution"
				subtitle="Choose a diet preset or fine-tune your protein and fat targets."
			/>
			<StepIssues issues={issues} />
			<div className="flex flex-col gap-6 rounded-xl border border-line bg-surface p-5 md:p-6">
				<PresetField form={form} preset={searchParams.preset} />
				<Divider />
				<div className="flex flex-col gap-6">
					<ProteinSliderField form={form} />
					<FatSliderField form={form} />
				</div>
			</div>
		</div>
	)
}

// ─── Layout helpers ───────────────────────────────────────────────────────────

function SectionHeader({title, subtitle}: {title: string; subtitle: string}) {
	return (
		<div className="flex items-start gap-3">
			<span className="mt-1 shrink-0 text-lagoon-deep">
				<DietIcon size={22} />
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

function PresetField({form, preset}: FieldProps & {preset?: PresetOption["value"]}) {
	return (
		<form.Field
			name="preset"
			defaultValue={preset}
			children={field => (
				<>
					<RadioCards
						name={field.name}
						value={field.state.value}
						options={PRESET_OPTIONS}
						onChange={v => {
							field.handleChange(v)
							// Auto-fill sliders from the named preset; leave them alone for custom.
							if (v !== "custom") {
								const {proteinPerKg, fatPct} = DIET_PRESETS[v as keyof typeof DIET_PRESETS]
								form.setFieldValue("proteinPerKg", proteinPerKg)
								form.setFieldValue("fatPct", fatPct)
							}
						}}
					/>
					<FieldInfo field={field} />
				</>
			)}
		/>
	)
}

function ProteinSliderField({form}: FieldProps) {
	const preset = useStore(form.store, state => state.values.preset)
	const isCustom = preset === "custom"

	return (
		<form.Field
			name="proteinPerKg"
			children={field => (
				<div className="flex flex-col gap-3">
					<div className="flex items-baseline justify-between gap-2">
						<Label className={cn("text-sm", !isCustom && "text-sea-ink-soft")}>Protein</Label>
						<span
							className={cn(
								"font-mono text-sm tabular-nums",
								isCustom ? "text-sea-ink" : "text-sea-ink-soft",
							)}
						>
							{(field.state.value ?? PROTEIN_PER_KG_BOUNDS.min).toFixed(1)} g/kg
						</span>
					</div>
					<Slider
						value={[field.state.value ?? PROTEIN_PER_KG_BOUNDS.min]}
						onValueChange={vals => {
							if (vals[0] !== undefined) field.handleChange(vals[0])
						}}
						min={PROTEIN_PER_KG_BOUNDS.min}
						max={PROTEIN_PER_KG_BOUNDS.max}
						step={0.1}
						disabled={!isCustom}
					/>
					<div className="flex justify-between text-[11px] text-sea-ink-soft">
						<span>{PROTEIN_PER_KG_BOUNDS.min} g/kg</span>
						<span>{PROTEIN_PER_KG_BOUNDS.max} g/kg</span>
					</div>
					<FieldInfo field={field} />
				</div>
			)}
		/>
	)
}

function FatSliderField({form}: FieldProps) {
	const preset = useStore(form.store, state => state.values.preset)
	const isCustom = preset === "custom"

	return (
		<form.Field
			name="fatPct"
			children={field => (
				<div className="flex flex-col gap-3">
					<div className="flex items-baseline justify-between gap-2">
						<Label className={cn("text-sm", !isCustom && "text-sea-ink-soft")}>Fat</Label>
						<span
							className={cn(
								"font-mono text-sm tabular-nums",
								isCustom ? "text-sea-ink" : "text-sea-ink-soft",
							)}
						>
							{Math.round((field.state.value ?? FAT_PCT_BOUNDS.min) * 100)}%
						</span>
					</div>
					<Slider
						value={[(field.state.value ?? FAT_PCT_BOUNDS.min) * 100]}
						onValueChange={vals => {
							if (vals[0] !== undefined) field.handleChange(vals[0] / 100)
						}}
						min={FAT_PCT_BOUNDS.min * 100}
						max={FAT_PCT_BOUNDS.max * 100}
						step={1}
						disabled={!isCustom}
					/>
					<div className="flex justify-between text-[11px] text-sea-ink-soft">
						<span>{FAT_PCT_BOUNDS.min * 100}%</span>
						<span>{FAT_PCT_BOUNDS.max * 100}%</span>
					</div>
					<FieldInfo field={field} />
				</div>
			)}
		/>
	)
}
