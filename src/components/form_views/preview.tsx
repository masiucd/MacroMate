import type {ReactNode} from "react"
import {cn} from "#/lib/utils"
import {ActivityIcon, DietIcon, EyeIcon, GoalIcon, StatsIcon} from "../icons"
import {Divider, type StepProps, StepShell} from "./step_primitives"

// ─── Data maps ─────────────────────────────────────────────────────────────────

const ACTIVITY_INFO: Record<string, {label: string; description: string; badge: string}> = {
	sedentary: {label: "Sedentary", description: "Desk job, little or no exercise", badge: "× 1.2"},
	light: {
		label: "Lightly active",
		description: "Light exercise 1–3 days / week",
		badge: "× 1.375",
	},
	moderate: {
		label: "Moderately active",
		description: "Moderate exercise 3–5 days / week",
		badge: "× 1.55",
	},
	very: {
		label: "Very active",
		description: "Hard exercise 6–7 days / week",
		badge: "× 1.725",
	},
	extra: {
		label: "Extra active",
		description: "Physical job + hard daily training",
		badge: "× 1.9",
	},
}

const GOAL_INFO: Record<string, {label: string; description: string; badge: string}> = {
	cut: {
		label: "Cut",
		description: "Lose body fat while preserving muscle",
		badge: "−250–500 kcal",
	},
	maintain: {
		label: "Maintain",
		description: "Keep your current weight and body composition",
		badge: "± 0 kcal",
	},
	bulk: {
		label: "Bulk",
		description: "Build muscle and gain weight in a controlled surplus",
		badge: "+250–500 kcal",
	},
}

const PRESET_INFO: Record<string, {label: string; description: string; badge: string}> = {
	balanced: {
		label: "Balanced",
		description: "A well-rounded mix of protein, carbs, and fat",
		badge: "1.6 g/kg · 30% fat",
	},
	"high-protein": {
		label: "High Protein",
		description: "Optimised for muscle retention and satiety",
		badge: "2.2 g/kg · 25% fat",
	},
	"low-carb": {
		label: "Low Carb",
		description: "Reduced carbs with moderate fat intake",
		badge: "1.8 g/kg · 50% fat",
	},
	keto: {
		label: "Keto",
		description: "Very low carbs, high fat for ketosis",
		badge: "1.8 g/kg · 70% fat",
	},
	custom: {
		label: "Custom",
		description: "Set your own protein and fat targets manually",
		badge: "Manual",
	},
}

// ─── Preview ──────────────────────────────────────────────────────────────────

export function Preview({issues, searchParams}: StepProps) {
	const weightUnit = searchParams.unit === "imperial" ? "lb" : "kg"

	return (
		<StepShell
			icon={<EyeIcon size={22} />}
			title="Preview your selected options"
			subtitle="Here are the options you have selected. Please review them before proceeding."
			issues={issues}
		>
			{/* Step 1 – Personal details */}
			<Section icon={<StatsIcon size={14} />} label="Your stats">
				<div className="grid grid-cols-2 gap-2">
					<CompactCard
						label="Unit system"
						value={searchParams.unit ? capitalize(searchParams.unit) : undefined}
					/>
					<CompactCard
						label="Sex"
						value={searchParams.sex ? capitalize(searchParams.sex) : undefined}
					/>
				</div>
				<div className="grid grid-cols-3 gap-2">
					<CompactCard
						label="Age"
						value={searchParams.age !== undefined ? String(searchParams.age) : undefined}
						unit="years"
					/>
					<CompactCard
						label="Weight"
						value={searchParams.weightKg !== undefined ? String(searchParams.weightKg) : undefined}
						unit={weightUnit}
					/>
					<CompactCard
						label="Height"
						value={searchParams.heightCm !== undefined ? String(searchParams.heightCm) : undefined}
						unit="cm"
					/>
				</div>
			</Section>

			<Divider />

			{/* Step 2 – Activity level */}
			<Section icon={<ActivityIcon size={14} />} label="Activity level">
				<DescriptiveCard
					info={searchParams.activity ? ACTIVITY_INFO[searchParams.activity] : undefined}
				/>
			</Section>

			<Divider />

			{/* Step 3 – Goal */}
			<Section icon={<GoalIcon size={14} />} label="Your goal">
				<DescriptiveCard info={searchParams.goal ? GOAL_INFO[searchParams.goal] : undefined} />
			</Section>

			<Divider />

			{/* Step 4 – Macros */}
			<Section icon={<DietIcon size={14} />} label="Macro distribution">
				<DescriptiveCard
					info={searchParams.preset ? PRESET_INFO[searchParams.preset] : undefined}
				/>
				<div className="grid grid-cols-2 gap-2">
					<CompactCard
						label="Protein"
						value={
							searchParams.proteinPerKg !== undefined
								? searchParams.proteinPerKg.toFixed(1)
								: undefined
						}
						unit="g / kg"
					/>
					<CompactCard
						label="Fat"
						value={
							searchParams.fatPct !== undefined
								? String(Math.round(searchParams.fatPct * 100))
								: undefined
						}
						unit="%"
					/>
				</div>
			</Section>
		</StepShell>
	)
}

// ─── Layout helpers ────────────────────────────────────────────────────────────

function capitalize(s: string): string {
	return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Labelled section with an icon kicker and a vertical stack of cards. */
function Section({icon, label, children}: {icon: ReactNode; label: string; children: ReactNode}) {
	return (
		<div className="flex flex-col gap-3">
			<div className="flex items-center gap-1.5">
				<span className="text-lagoon-deep">{icon}</span>
				<span className="island-kicker">{label}</span>
			</div>
			<div className="flex flex-col gap-2">{children}</div>
		</div>
	)
}

/**
 * Small card for simple key → value pairs (unit, sex, age, weight, height,
 * protein, fat). Dims to a "not set" placeholder when `value` is absent.
 */
function CompactCard({label, value, unit}: {label: string; value?: string; unit?: string}) {
	const empty = value === undefined
	return (
		<div
			className={cn(
				"flex flex-col gap-1 rounded-lg border px-4 py-3",
				empty ? "border-line bg-foam" : "border-lagoon/20 bg-lagoon/5",
			)}
		>
			<span className="text-sea-ink-soft text-xs">{label}</span>
			<div className="flex items-baseline gap-1">
				<span
					className={cn(
						"font-medium text-sm",
						empty ? "text-sea-ink-soft/50 italic" : "text-sea-ink",
					)}
				>
					{value ?? "—"}
				</span>
				{unit && !empty ? <span className="text-sea-ink-soft text-xs">{unit}</span> : null}
			</div>
		</div>
	)
}

type InfoEntry = {label: string; description: string; badge: string}

/**
 * Full-width card that mirrors the selected-state of `RadioCards` — showing a
 * label, description, and a right-aligned badge. Used for activity, goal, and
 * diet preset.
 */
function DescriptiveCard({info}: {info?: InfoEntry}) {
	const empty = info === undefined
	return (
		<div
			className={cn(
				"flex items-center justify-between gap-4 rounded-lg border px-4 py-3",
				empty ? "border-line bg-foam" : "border-lagoon/20 bg-lagoon/5",
			)}
		>
			<div className="flex flex-col gap-0.5">
				<span
					className={cn(
						"font-medium text-sm",
						empty ? "text-sea-ink-soft/50 italic" : "text-sea-ink",
					)}
				>
					{info?.label ?? "—"}
				</span>
				{info ? <span className="text-sea-ink-soft text-xs">{info.description}</span> : null}
			</div>
			{info ? (
				<span className="shrink-0 font-mono font-semibold text-palm text-xs">{info.badge}</span>
			) : null}
		</div>
	)
}
