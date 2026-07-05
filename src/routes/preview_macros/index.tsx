import {createFileRoute, Link} from "@tanstack/react-router"
import {Heading, Text} from "#/components/typography"
import {Button} from "#/components/ui/button"
import {PageWrapper} from "#/components/wrappers/page_wrapper"
import {bmr, kcalForGoal, type MacroSplit, splitMacros, tdee} from "#/features/calculator/formulas"
import {type FormValues, formSchema} from "#/features/calculator/schema"
import {cn} from "#/lib/utils"

export const Route = createFileRoute("/preview_macros/")({
	component: RouteComponent,
	validateSearch: search => formSchema.parse(search),
	errorComponent: ErrorComponent,
})

// ─── Error fallback ──────────────────────────────────────────────────────────

function ErrorComponent() {
	return (
		<PageWrapper className="page-wrap flex min-h-[60vh] flex-col items-center justify-center gap-6 py-16 text-center">
			<span className="text-5xl" aria-hidden>
				⚠️
			</span>
			<Heading as="h1" size="h2">
				Invalid inputs
			</Heading>
			<Text variant="lead">The link you followed contained incomplete or invalid data.</Text>
			<Button asChild>
				<Link to="/calculator">Start fresh →</Link>
			</Button>
		</PageWrapper>
	)
}

// ─── Main component ───────────────────────────────────────────────────────────

function RouteComponent() {
	const params = Route.useSearch() as FormValues

	const bmrVal = bmr({
		sex: params.sex,
		weightKg: params.weightKg,
		heightCm: params.heightCm,
		age: params.age,
	})
	const tdeeVal = tdee(bmrVal, params.activity)
	const kcal = kcalForGoal(tdeeVal, params.goal)
	const macros = splitMacros({
		kcal,
		weightKg: params.weightKg,
		proteinPerKg: params.proteinPerKg,
		fatPct: params.fatPct,
	})

	return (
		<PageWrapper className="page-wrap space-y-8 py-12">
			<Header goal={params.goal} />
			{!macros.isFeasible && <InfeasibilityWarning />}
			<KcalHero kcal={kcal} bmrVal={bmrVal} tdeeVal={tdeeVal} goal={params.goal} />
			<MacroBreakdown macros={macros} />
			<HowWeGotThere />
			<Actions params={params} />
		</PageWrapper>
	)
}

// ─── Header ──────────────────────────────────────────────────────────────────

const GOAL_LABELS: Record<FormValues["goal"], string> = {
	cut: "Cut · caloric deficit",
	maintain: "Maintain · caloric balance",
	bulk: "Bulk · caloric surplus",
}

function Header({goal}: {goal: FormValues["goal"]}) {
	return (
		<div className="rise-in space-y-1 text-center">
			<p className="island-kicker">Your results</p>
			<Heading as="h1" size="h1" className="display-title">
				Your plan
			</Heading>
			<Text variant="lead" className="mt-1">
				{GOAL_LABELS[goal]}
			</Text>
		</div>
	)
}

// ─── Infeasibility warning ────────────────────────────────────────────────────

function InfeasibilityWarning() {
	return (
		<div
			role="alert"
			className="island-shell rise-in rounded-xl border border-destructive/30 bg-destructive/5 px-5 py-4"
		>
			<p className="font-semibold text-destructive-foreground text-sm">
				⚠️ Your macro split isn't fully feasible
			</p>
			<p className="mt-1 text-sea-ink-soft text-sm leading-relaxed">
				With the current protein and fat targets, carbohydrates would be negative — so they've been
				clamped to zero. Consider reducing protein or fat percentage to get a balanced split.
			</p>
		</div>
	)
}

// ─── kcal hero card ───────────────────────────────────────────────────────────

const GOAL_DELTA_LABELS: Record<FormValues["goal"], string> = {
	cut: "−20%",
	maintain: "±0%",
	bulk: "+15%",
}

function KcalHero({
	kcal,
	bmrVal,
	tdeeVal,
	goal,
}: {
	kcal: number
	bmrVal: number
	tdeeVal: number
	goal: FormValues["goal"]
}) {
	return (
		<div className="island-shell rise-in rounded-2xl border p-8 text-center">
			<p className="island-kicker mb-3">Daily target</p>
			<p className="display-title font-bold text-7xl text-sea-ink tabular-nums sm:text-8xl">
				{Math.round(kcal).toLocaleString()}
			</p>
			<p className="mt-1 font-semibold text-2xl text-sea-ink-soft">kcal / day</p>
			<p className="mt-4 text-sea-ink-soft text-sm">
				BMR&nbsp;
				<span className="font-semibold text-sea-ink">{Math.round(bmrVal).toLocaleString()}</span>
				&nbsp;·&nbsp;TDEE&nbsp;
				<span className="font-semibold text-sea-ink">{Math.round(tdeeVal).toLocaleString()}</span>
				&nbsp;·&nbsp;Goal&nbsp;
				<span className="font-semibold text-sea-ink">{GOAL_DELTA_LABELS[goal]}</span>
			</p>
		</div>
	)
}

// ─── Macro breakdown ──────────────────────────────────────────────────────────

const MACRO_CONFIG = [
	{key: "protein", label: "Protein", color: "bg-lagoon", textColor: "text-lagoon-deep"},
	{key: "carbs", label: "Carbs", color: "bg-palm", textColor: "text-palm"},
	{key: "fat", label: "Fat", color: "bg-[#e8a838]", textColor: "text-[#b87c10]"},
] as const

function MacroBreakdown({macros}: {macros: MacroSplit}) {
	const segments = [
		{pct: macros.proteinPct, grams: macros.proteinG, ...MACRO_CONFIG[0]},
		{pct: macros.carbsPct, grams: macros.carbsG, ...MACRO_CONFIG[1]},
		{pct: macros.fatPct, grams: macros.fatG, ...MACRO_CONFIG[2]},
	]

	return (
		<div className="island-shell rise-in space-y-6 rounded-2xl border p-6 sm:p-8">
			<p className="island-kicker">Macro split</p>

			{/* Stacked bar */}
			<div
				className="flex h-8 w-full overflow-hidden rounded-full"
				role="img"
				aria-label={`Macro split: ${Math.round(macros.proteinPct * 100)}% protein, ${Math.round(macros.carbsPct * 100)}% carbs, ${Math.round(macros.fatPct * 100)}% fat`}
			>
				{segments.map(s => (
					<div
						key={s.key}
						className={cn(s.color, "transition-all duration-500")}
						style={{width: `${(s.pct * 100).toFixed(1)}%`}}
					/>
				))}
			</div>

			{/* Macro cards */}
			<div className="grid grid-cols-3 gap-3 sm:gap-4">
				{segments.map(s => (
					<MacroCard
						key={s.key}
						label={s.label}
						grams={s.grams}
						pct={s.pct}
						colorClass={s.color}
						textColorClass={s.textColor}
					/>
				))}
			</div>
		</div>
	)
}

function MacroCard({
	label,
	grams,
	pct,
	colorClass,
	textColorClass,
}: {
	label: string
	grams: number
	pct: number
	colorClass: string
	textColorClass: string
}) {
	return (
		<div className="island-shell rounded-xl border p-4 text-center">
			<div className={cn("mx-auto mb-2 h-1.5 w-8 rounded-full", colorClass)} />
			<p className="font-bold text-2xl text-sea-ink tabular-nums sm:text-3xl">
				{Math.round(grams)}
				<span className="font-normal text-base text-sea-ink-soft">g</span>
			</p>
			<p className="mt-0.5 font-semibold text-sea-ink text-sm">{label}</p>
			<p className={cn("text-xs", textColorClass)}>{Math.round(pct * 100)}%</p>
		</div>
	)
}

// ─── How we got there ─────────────────────────────────────────────────────────

function HowWeGotThere() {
	return (
		<details className="island-shell group rounded-xl border px-5 py-4">
			<summary className="cursor-pointer list-none">
				<div className="flex items-center justify-between gap-2">
					<span className="font-semibold text-sea-ink text-sm">How we got there</span>
					<span
						className="text-sea-ink-soft text-xs transition-transform duration-200 group-open:rotate-180"
						aria-hidden
					>
						▾
					</span>
				</div>
			</summary>
			<div className="mt-3 space-y-2 border-line border-t pt-3 text-sea-ink-soft text-sm leading-relaxed">
				<p>
					<strong className="text-sea-ink">BMR</strong> (Basal Metabolic Rate) is calculated using
					the Mifflin-St Jeor equation — the most validated formula for resting energy expenditure.
				</p>
				<p>
					<strong className="text-sea-ink">TDEE</strong> (Total Daily Energy Expenditure) multiplies
					your BMR by your activity factor to account for how much you move each day.
				</p>
				<p>
					Your <strong className="text-sea-ink">calorie target</strong> adjusts TDEE for your goal:
					a 20% deficit for cutting, no change for maintenance, or a 15% surplus for bulking.
				</p>
				<p>
					<strong className="text-sea-ink">Macros</strong> distribute those calories using your
					chosen protein target (g/kg of body weight) and fat percentage, with the remainder
					allocated to carbohydrates.
				</p>
			</div>
		</details>
	)
}

// ─── Action buttons ───────────────────────────────────────────────────────────

function Actions({params}: {params: FormValues}) {
	const copyLink = () => {
		navigator.clipboard.writeText(window.location.href).catch(() => {})
	}

	return (
		<div className="rise-in flex flex-wrap justify-center gap-3 pt-2 pb-4">
			<Button asChild variant="default" size="lg">
				<Link
					to="/calculator"
					search={{
						page: "personal_details",
						...params,
					}}
				>
					Edit inputs
				</Link>
			</Button>
			<Button asChild variant="outline" size="lg">
				<Link to="/calculator" search={{page: "personal_details"}}>
					Start over
				</Link>
			</Button>
			<Button variant="ghost" size="lg" onClick={copyLink}>
				Copy link
			</Button>
		</div>
	)
}
