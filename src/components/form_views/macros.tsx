import {useStore} from "@tanstack/react-form"
import {FieldInfo} from "#/components/field_info"
import {DietIcon} from "#/components/icons"
import {Label} from "#/components/ui/label"
import {Slider} from "#/components/ui/slider"
import {DIET_PRESETS} from "#/features/calculator/formulas"
import {
	type DIET_PRESET_VALUES,
	FAT_PCT_BOUNDS,
	PROTEIN_PER_KG_BOUNDS,
} from "#/features/calculator/schema"
import {cn} from "#/lib/utils"
import {
	Divider,
	type FieldProps,
	type RadioCardOption,
	RadioCards,
	type StepProps,
	StepShell,
} from "./step_primitives"

type PresetValue = (typeof DIET_PRESET_VALUES)[number]

const PRESET_OPTIONS: RadioCardOption<PresetValue>[] = [
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

export function Macros({form, issues, searchParams}: StepProps) {
	return (
		<StepShell
			icon={<DietIcon size={22} />}
			title="Macro distribution"
			subtitle="Choose a diet preset or fine-tune your protein and fat targets."
			issues={issues}
		>
			<PresetField form={form} preset={searchParams.preset} />
			<Divider />
			<div className="flex flex-col gap-6">
				<ProteinSliderField form={form} />
				<FatSliderField form={form} />
			</div>
		</StepShell>
	)
}

function PresetField({form, preset}: FieldProps & {preset?: PresetValue}) {
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

	console.log("preset", preset, "isCustom", isCustom)

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
