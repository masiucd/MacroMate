import {useStore} from "@tanstack/react-form"
import {Info} from "lucide-react"
import {useState} from "react"
import {FieldInfo} from "#/components/field_info"
import {DietIcon} from "#/components/icons"
import {Label} from "#/components/ui/label"
import {Slider} from "#/components/ui/slider"
import {Switch} from "#/components/ui/switch"
import {
	bmr as calcBmr,
	tdee as calcTdee,
	DIET_PRESETS,
	KCAL_PER_G,
	kcalForGoal,
} from "#/features/calculator/formulas"
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
	const [overrideCarbs, setOverrideCarbs] = useState(false)
	const preset = useStore(form.store, s => s.values.preset)
	const isCustom = preset === "custom"

	return (
		<StepShell
			icon={<DietIcon size={22} />}
			title="Macro distribution"
			subtitle="Choose a diet preset or fine-tune your protein and fat targets."
			issues={issues}
		>
			<PresetField
				form={form}
				preset={searchParams.preset}
				onPresetChange={() => setOverrideCarbs(false)}
			/>
			<Divider />
			<MacroInfoCallout isCustom={isCustom} overrideCarbs={overrideCarbs} />
			<div className="flex flex-col gap-6">
				<ProteinSliderField form={form} />
				<FatSliderField form={form} overriddenByCarbs={overrideCarbs} />
				<CarbsSliderField
					form={form}
					overrideCarbs={overrideCarbs}
					setOverrideCarbs={setOverrideCarbs}
				/>
			</div>
		</StepShell>
	)
}

// ─── Info callout ──────────────────────────────────────────────────────────────

function MacroInfoCallout({isCustom, overrideCarbs}: {isCustom: boolean; overrideCarbs: boolean}) {
	const message = overrideCarbs
		? "Carbs override is active — fat will adjust automatically to balance your targets."
		: isCustom
			? 'These are recommended starting points. Toggle "Override carbs" below to set carbs directly instead of fat.'
			: "Preset ratios are evidence-based recommendations. Switch to Custom if you need to adjust individual targets, including carbs."

	return (
		<div className="flex gap-2.5 rounded-lg border border-lagoon/30 bg-lagoon/5 px-3.5 py-3">
			<Info size={14} className="mt-0.5 shrink-0 text-lagoon-deep" aria-hidden />
			<p className="text-[12px] leading-relaxed text-sea-ink-soft">{message}</p>
		</div>
	)
}

// ─── Preset field ──────────────────────────────────────────────────────────────

function PresetField({
	form,
	preset,
	onPresetChange,
}: FieldProps & {preset?: PresetValue; onPresetChange: () => void}) {
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
							onPresetChange()
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

// ─── Protein slider ────────────────────────────────────────────────────────────

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

// ─── Fat slider ────────────────────────────────────────────────────────────────

function FatSliderField({form, overriddenByCarbs}: FieldProps & {overriddenByCarbs: boolean}) {
	const preset = useStore(form.store, state => state.values.preset)
	const isCustom = preset === "custom"
	const isDisabled = !isCustom || overriddenByCarbs

	return (
		<form.Field
			name="fatPct"
			children={field => (
				<div className="flex flex-col gap-3">
					<div className="flex items-baseline justify-between gap-2">
						<div className="flex items-center gap-2">
							<Label className={cn("text-sm", isDisabled && "text-sea-ink-soft")}>Fat</Label>
							{overriddenByCarbs && isCustom && (
								<span className="text-[11px] text-sea-ink-soft italic">auto</span>
							)}
						</div>
						<span
							className={cn(
								"font-mono text-sm tabular-nums",
								isDisabled ? "text-sea-ink-soft" : "text-sea-ink",
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
						disabled={isDisabled}
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

// ─── Carbs slider ──────────────────────────────────────────────────────────────

function CarbsSliderField({
	form,
	overrideCarbs,
	setOverrideCarbs,
}: FieldProps & {
	overrideCarbs: boolean
	setOverrideCarbs: (v: boolean) => void
}) {
	const preset = useStore(form.store, s => s.values.preset)
	const isCustom = preset === "custom"

	// Read all values needed to compute kcal and derive carbsPct.
	const sex = useStore(form.store, s => s.values.sex)
	const age = useStore(form.store, s => s.values.age)
	const weightKg = useStore(form.store, s => s.values.weightKg)
	const heightCm = useStore(form.store, s => s.values.heightCm)
	const activity = useStore(form.store, s => s.values.activity)
	const goal = useStore(form.store, s => s.values.goal)
	const proteinPerKg = useStore(form.store, s => s.values.proteinPerKg)
	const fatPct = useStore(form.store, s => s.values.fatPct)

	// Derive carbs% from the remaining calories after protein and fat.
	let carbsPct: number | null = null
	let proteinPct: number | null = null
	let kcal: number | null = null

	if (
		sex &&
		age &&
		weightKg &&
		heightCm &&
		activity &&
		goal &&
		proteinPerKg != null &&
		fatPct != null
	) {
		const bmrVal = calcBmr({sex, age, weightKg, heightCm})
		const tdeeVal = calcTdee(bmrVal, activity)
		kcal = kcalForGoal(tdeeVal, goal)
		proteinPct = (proteinPerKg * weightKg * KCAL_PER_G.protein) / kcal
		carbsPct = Math.max(0, 1 - proteinPct - fatPct)
	}

	// Dynamic max for the carbs slider: leave fat at least at its minimum.
	const carbsMax =
		proteinPct != null ? Math.max(0, 1 - proteinPct - FAT_PCT_BOUNDS.min) : 1 - FAT_PCT_BOUNDS.min

	const displayPct = carbsPct != null ? Math.round(carbsPct * 100) : null
	const isSliderActive = isCustom && overrideCarbs

	function handleCarbsChange(newCarbsPct: number) {
		if (proteinPct == null) return
		const newFatPct = Math.max(
			FAT_PCT_BOUNDS.min,
			Math.min(FAT_PCT_BOUNDS.max, 1 - proteinPct - newCarbsPct),
		)
		form.setFieldValue("fatPct", newFatPct)
	}

	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-baseline justify-between gap-2">
				<div className="flex items-center gap-2">
					<Label className={cn("text-sm", !isSliderActive && "text-sea-ink-soft")}>Carbs</Label>
					{isCustom && (
						<div className="flex items-center gap-1.5">
							<Switch
								id="override-carbs"
								size="sm"
								checked={overrideCarbs}
								onCheckedChange={setOverrideCarbs}
								aria-label="Override carbs target"
							/>
							<label
								htmlFor="override-carbs"
								className="cursor-pointer text-[11px] text-sea-ink-soft select-none"
							>
								Override
							</label>
						</div>
					)}
				</div>
				<span
					className={cn(
						"font-mono text-sm tabular-nums",
						isSliderActive ? "text-sea-ink" : "text-sea-ink-soft",
					)}
				>
					{displayPct != null ? `${displayPct}%` : "—"}
				</span>
			</div>
			<Slider
				value={[carbsPct != null ? carbsPct * 100 : 0]}
				onValueChange={vals => {
					if (vals[0] !== undefined) handleCarbsChange(vals[0] / 100)
				}}
				min={0}
				max={Math.round(carbsMax * 100)}
				step={1}
				disabled={!isSliderActive}
			/>
			<div className="flex justify-between text-[11px] text-sea-ink-soft">
				<span>0%</span>
				<span>{Math.round(carbsMax * 100)}%</span>
			</div>
		</div>
	)
}
