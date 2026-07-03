import {useLocation} from "@tanstack/react-router"
import {useState} from "react"
import {bmr, kcalForGoal, type MacroSplit, splitMacros, tdee} from "#/features/calculator/formulas"
import type {CalculatorSearchParams} from "#/features/calculator/types"
import {cn} from "#/lib/utils"
import {CheckIcon, CopyIcon, LinkIcon} from "../icons"
import {Button} from "../ui/button"
import {Divider, type StepProps, StepShell} from "./step_primitives"

// ─── Type narrowing ────────────────────────────────────────────────────────────

type RequiredParams = Required<
	Pick<
		CalculatorSearchParams,
		"sex" | "weightKg" | "heightCm" | "age" | "activity" | "goal" | "proteinPerKg" | "fatPct"
	>
>

function hasAllRequiredParams(
	p: StepProps["searchParams"],
): p is StepProps["searchParams"] & RequiredParams {
	return (
		p.sex !== undefined &&
		p.weightKg !== undefined &&
		p.heightCm !== undefined &&
		p.age !== undefined &&
		p.activity !== undefined &&
		p.goal !== undefined &&
		p.proteinPerKg !== undefined &&
		p.fatPct !== undefined
	)
}

// ─── Copy helpers ─────────────────────────────────────────────────────────────

function formatMacrosAsText(macros: MacroSplit): string {
	const pct = (n: number) => `${Math.round(n * 100)}%`
	const g = (n: number) => `${Math.round(n)}g`
	return [
		"Daily Macro Targets",
		"───────────────────",
		`Calories:  ${Math.round(macros.kcal)} kcal`,
		`Protein:   ${g(macros.proteinG)} (${pct(macros.proteinPct)})`,
		`Carbs:     ${g(macros.carbsG)} (${pct(macros.carbsPct)})`,
		`Fat:       ${g(macros.fatG)} (${pct(macros.fatPct)})`,
	].join("\n")
}

function useCopyButton() {
	const [copied, setCopied] = useState(false)
	function copy(getText: () => string) {
		navigator.clipboard.writeText(getText()).then(() => {
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		})
	}
	return {copied, copy}
}

export function Result({issues, searchParams}: Pick<StepProps, "issues" | "searchParams">) {
	const copyText = useCopyButton()
	const copyLink = useCopyButton()

	if (!hasAllRequiredParams(searchParams)) {
		return (
			<StepShell
				icon={<CheckIcon size={22} />}
				title="Final results"
				subtitle="Complete all steps above to unlock your personalised daily targets."
				issues={issues ?? []}
			>
				{/* Skeleton mirrors the real result layout so the user knows what to expect */}
				<div aria-hidden className="pointer-events-none select-none space-y-4">
					<div className="flex flex-col gap-1">
						<div className="h-3 w-28 animate-pulse rounded bg-sea-ink/10" />
						<div className="mt-1 flex items-baseline gap-2">
							<div className="h-11 w-36 animate-pulse rounded-md bg-sea-ink/10" />
							<div className="h-5 w-16 animate-pulse rounded bg-sea-ink/10" />
						</div>
					</div>
					<div className="h-2.5 w-full animate-pulse rounded-full bg-sea-ink/10" />
					<div className="grid grid-cols-3 gap-2">
						<div className="h-[68px] animate-pulse rounded-lg border border-lagoon/30 bg-lagoon/5" />
						<div className="h-[68px] animate-pulse rounded-lg border border-warning/30 bg-warning/5" />
						<div className="h-[68px] animate-pulse rounded-lg border border-palm/30 bg-palm/5" />
					</div>
				</div>
				<p className="text-center text-sea-ink-soft/50 text-xs">
					Complete all steps to see your results
				</p>
			</StepShell>
		)
	}

	const bmrValue = bmr({
		sex: searchParams.sex,
		weightKg: searchParams.weightKg,
		heightCm: searchParams.heightCm,
		age: searchParams.age,
	})

	const tdeeVal = tdee(bmrValue, searchParams.activity)
	const kcal = kcalForGoal(tdeeVal, searchParams.goal)
	const macros = splitMacros({
		kcal,
		weightKg: searchParams.weightKg,
		proteinPerKg: searchParams.proteinPerKg,
		fatPct: searchParams.fatPct,
	})

	return (
		<StepShell
			icon={<CheckIcon size={22} />}
			title="Final results"
			subtitle="Here are your calculated daily targets based on the information you provided."
			issues={issues ?? []}
		>
			<CalorieNumber kcal={macros.kcal} />

			<MacroDistributionBar macros={macros} />

			<MacroCards macros={macros} />

			<Divider />

			<BmrAndTdee bmr={bmrValue} tdee={tdeeVal} />

			<Actions copyText={copyText} copyLink={copyLink} macros={macros} />
		</StepShell>
	)
}

function CalorieNumber({kcal}: {kcal: number}) {
	return (
		<div className="flex flex-col gap-1">
			<span className="island-kicker">Daily calorie target</span>
			<div className="flex items-baseline gap-2">
				<span className="display-title font-bold text-5xl text-sea-ink">
					{Math.round(kcal).toLocaleString()}
				</span>
				<span className="text-lg text-sea-ink-soft">kcal / day</span>
			</div>
		</div>
	)
}

function MacroDistributionBar({macros}: {macros: MacroSplit}) {
	const proteinPct = Math.round(macros.proteinPct * 100)
	const carbsPct = Math.round(macros.carbsPct * 100)
	const fatPct = 100 - proteinPct - carbsPct
	return (
		<div className="flex flex-col gap-2">
			<div className="flex h-2.5 overflow-hidden rounded-full">
				<div className="bg-lagoon" style={{width: `${proteinPct}%`}} />
				<div className="bg-warning" style={{width: `${carbsPct}%`}} />
				<div className="bg-palm" style={{width: `${fatPct}%`}} />
			</div>
			<div className="flex gap-4">
				{(
					[
						{label: "Protein", dot: "bg-lagoon"},
						{label: "Carbs", dot: "bg-warning"},
						{label: "Fat", dot: "bg-palm"},
					] as const
				).map(({label, dot}) => (
					<span key={label} className="flex items-center gap-1.5 text-sea-ink-soft text-xs">
						<span className={cn("size-2 rounded-full", dot)} />
						{label}
					</span>
				))}
			</div>
		</div>
	)
}

function BmrAndTdee({bmr, tdee}: {bmr: number; tdee: number}) {
	return (
		<div className="grid grid-cols-2 gap-2">
			<StatCard label="BMR" value={Math.round(bmr)} hint="Base metabolic rate at rest" />
			<StatCard label="TDEE" value={Math.round(tdee)} hint="Total daily energy expenditure" />
		</div>
	)
}

function MacroCards({macros}: {macros: MacroSplit}) {
	return (
		<div className="grid grid-cols-3 gap-2">
			<MacroCard
				label="Protein"
				grams={macros.proteinG}
				pct={macros.proteinPct}
				variant="protein"
			/>
			<MacroCard label="Carbs" grams={macros.carbsG} pct={macros.carbsPct} variant="carbs" />
			<MacroCard label="Fat" grams={macros.fatG} pct={macros.fatPct} variant="fat" />
		</div>
	)
}

interface ActionsProps {
	copyText: ReturnType<typeof useCopyButton>
	copyLink: ReturnType<typeof useCopyButton>
	macros: MacroSplit
}

function Actions({copyText, copyLink, macros}: ActionsProps) {
	const params = useLocation()

	return (
		<div className="flex gap-2">
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() => copyText.copy(() => formatMacrosAsText(macros))}
			>
				<CopyIcon size={14} />
				{copyText.copied ? "Copied!" : "Copy results"}
			</Button>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={() =>
					copyLink.copy(() => {
						// if we are on local develeopemnt then append localhost:3333 to the link otherwise we are on production and we can just use the relative link
						if (window.location.hostname === "localhost") {
							return `http://localhost:3333/preview_macros${params.searchStr}`
						}
						return `/preview_macros${params.searchStr}`
					})
				}
			>
				<LinkIcon size={14} />
				{copyLink.copied ? "Copied!" : "Copy link"}
			</Button>
		</div>
	)
}

// TODO Direct to anew page// TODO Direct to a new page with the searchParams when user clicks on "Copy link" button, so they can share their results with others.	)

type MacroVariant = "protein" | "carbs" | "fat"

const MACRO_STYLES: Record<
	MacroVariant,
	{border: string; bg: string; valueText: string; dot: string; bar: string}
> = {
	protein: {
		border: "border-lagoon/30",
		bg: "bg-lagoon/5",
		valueText: "text-lagoon-deep",
		dot: "bg-lagoon",
		bar: "bg-lagoon",
	},
	carbs: {
		border: "border-warning/30",
		bg: "bg-warning/5",
		valueText: "text-warning-foreground",
		dot: "bg-warning",
		bar: "bg-warning",
	},
	fat: {
		border: "border-palm/30",
		bg: "bg-palm/5",
		valueText: "text-palm",
		dot: "bg-palm",
		bar: "bg-palm",
	},
}

interface MacroCardProps {
	label: string
	grams: number
	pct: number
	variant: MacroVariant
}

function MacroCard({label, grams, pct, variant}: MacroCardProps) {
	const styles = MACRO_STYLES[variant]
	return (
		<div
			className={cn("flex flex-col gap-2 rounded-lg border px-4 py-3", styles.border, styles.bg)}
		>
			<div className="flex items-center gap-1.5">
				<span className={cn("size-2 shrink-0 rounded-full", styles.dot)} />
				<span className="island-kicker">{label}</span>
			</div>
			<div className="flex flex-col gap-0.5">
				<span className={cn("font-semibold text-xl leading-none", styles.valueText)}>
					{Math.round(grams)}g
				</span>
				<span className="text-sea-ink-soft text-xs">{Math.round(pct * 100)}% of kcal</span>
			</div>
		</div>
	)
}

function StatCard({label, value, hint}: {label: string; value: number; hint: string}) {
	return (
		<div className="flex flex-col gap-1 rounded-lg border border-line bg-foam px-4 py-3">
			<span className="island-kicker">{label}</span>
			<div className="flex items-baseline gap-1">
				<span className="font-semibold text-base text-sea-ink">{value.toLocaleString()}</span>
				<span className="text-sea-ink-soft text-xs">kcal</span>
			</div>
			<span className="text-sea-ink-soft/70 text-xs">{hint}</span>
		</div>
	)
}
