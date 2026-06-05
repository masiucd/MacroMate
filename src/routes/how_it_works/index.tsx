import {createFileRoute, Link} from "@tanstack/react-router"
import {ActivityIcon, DietIcon, GoalIcon, StatsIcon} from "#/components/icons"
import {Button} from "#/components/ui/button"
import {PageWrapper} from "#/components/wrappers/page_wrapper"

export const Route = createFileRoute("/how_it_works/")({
	component: RouteComponent,
})

// ─── Data ─────────────────────────────────────────────────────────────────────

const STEPS = [
	{
		number: "01",
		title: "Enter your stats",
		description:
			"Provide your age, biological sex, weight, and height. You can use either metric (kg / cm) or imperial (lb / ft + in) — MacroMate converts everything automatically.",
		// title: "📋",
	},
	{
		number: "02",
		title: "Pick your activity level",
		description:
			"How active are you day-to-day? From sedentary desk work to twice-daily training sessions, your activity level determines your TDEE multiplier.",
		// title: "🏃",
	},
	{
		number: "03",
		title: "Set your goal",
		description:
			"Are you looking to lose fat (cut), maintain your current weight, or build muscle (bulk)? Your goal shifts the final calorie target up or down from your TDEE.",
		// title: "🎯",
	},
	{
		number: "04",
		title: "Choose a diet preset",
		description:
			"Select a macro distribution that fits your lifestyle — Balanced, High-Protein, Low-Carb, or Keto. MacroMate converts calories into exact gram targets for protein, carbs, and fat.",
		// title: "🥗",
	},
] as const

const DIET_PRESETS = [
	{
		name: "Balanced",
		split: "30 % protein · 40 % carbs · 30 % fat",
		best: "General health & sustainable dieting",
		description:
			"A well-rounded split that works for most people. Good energy from carbs, ample protein to preserve muscle, and healthy fats for hormones and satiety.",
	},
	{
		name: "High-Protein",
		split: "40 % protein · 35 % carbs · 25 % fat",
		best: "Muscle building or aggressive cuts",
		description:
			"Bumped-up protein to maximise muscle protein synthesis and keep hunger in check while in a calorie deficit. Ideal alongside resistance training.",
	},
	{
		name: "Low-Carb",
		split: "30 % protein · 20 % carbs · 50 % fat",
		best: "Blood-sugar control & fat adaptation",
		description:
			"Reduces carbohydrate intake significantly to lower insulin response and shift the body toward using fat as its primary fuel source.",
	},
	{
		name: "Keto",
		split: "25 % protein · 5 % carbs · 70 % fat",
		best: "Ketosis & metabolic flexibility",
		description:
			"Strict carb restriction puts the body into ketosis, where fat (and ketones) become the dominant energy source. Requires discipline but effective for many.",
	},
] as const

const ACTIVITY_LEVELS = [
	{level: "Sedentary", multiplier: "× 1.2", example: "Desk job, little or no exercise"},
	{level: "Lightly active", multiplier: "× 1.375", example: "Light exercise 1–3 days / week"},
	{level: "Moderately active", multiplier: "× 1.55", example: "Moderate exercise 3–5 days / week"},
	{level: "Very active", multiplier: "× 1.725", example: "Hard exercise 6–7 days / week"},
	{level: "Extra active", multiplier: "× 1.9", example: "Physical job + hard daily training"},
] as const

const FAQS = [
	{
		q: "What formula does MacroMate use?",
		a: "MacroMate uses the Mifflin-St Jeor equation, which is considered the most accurate BMR formula for most adults. It factors in your weight, height, age, and sex.",
	},
	{
		q: "How accurate are the results?",
		a: "The output is an evidence-based estimate, not a medical prescription. Real-world factors like genetics, sleep, and stress affect your metabolism. Use the numbers as a starting point, track your weight for 2–3 weeks, and adjust if needed.",
	},
	{
		q: "How much of a calorie deficit / surplus should I use?",
		a: 'MacroMate applies a moderate ±500 kcal adjustment from your TDEE for cut and bulk goals — roughly 0.5 kg (1 lb) change per week. This is the "sweet spot" backed by most sports-nutrition research.',
	},
	{
		q: "Do I need an account or to sign up?",
		a: "No. MacroMate is completely free and requires no account. Enter your details, get your numbers, done.",
	},
	{
		q: "Can I change units mid-calculation?",
		a: "Yes. The unit toggle is always visible in the calculator. Switching between metric and imperial re-converts your current inputs automatically.",
	},
] as const

// ─── Page ──────────────────────────────────────────────────────────────────────

function RouteComponent() {
	return (
		<PageWrapper className="page-wrap space-y-20 py-16">
			<Hero />
			<TheGoal />
			<TheScience />
			<Steps />
			<DietPresets />
			<ActivityTable />
			<FAQ />
			<CTA />
		</PageWrapper>
	)
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
	return (
		<section className="rise-in mx-auto max-w-2xl space-y-5 text-center">
			<p className="island-kicker">The complete guide</p>
			<h1 className="display-title font-bold text-5xl text-sea-ink leading-tight sm:text-6xl">
				How MacroMate works
			</h1>
			<p className="text-lg text-sea-ink-soft leading-relaxed">
				From the science behind the numbers to what you'll walk away with — everything you need to
				know before (or after) you calculate.
			</p>
		</section>
	)
}

function TheGoal() {
	return (
		<section
			aria-labelledby="goal-heading"
			className="island-shell mx-auto max-w-3xl space-y-5 rounded-2xl border p-10"
		>
			<p className="island-kicker">The goal</p>
			<h2 id="goal-heading" className="display-title font-bold text-3xl text-sea-ink">
				One question: how much should you eat?
			</h2>
			<p className="text-sea-ink-soft leading-relaxed">
				Most people have no idea how many calories they actually need — and even fewer know the
				right split of protein, carbs, and fat for their specific goal. Generic advice like{" "}
				<em>"eat less, move more"</em> ignores your body entirely.
			</p>
			<p className="text-sea-ink-soft leading-relaxed">
				MacroMate's goal is simple:{" "}
				<strong className="text-sea-ink">
					give you a personalised, science-backed daily nutrition target in under 60 seconds
				</strong>
				, with no account, no subscription, and no noise.
			</p>
			<p className="text-sea-ink-soft leading-relaxed">
				Whether you want to lose fat, build muscle, or just eat better, a clear calorie and macro
				target is the single most impactful tool you can have.
			</p>
		</section>
	)
}

function TheScience() {
	return (
		<section aria-labelledby="science-heading" className="mx-auto max-w-3xl space-y-8">
			<div className="space-y-2 text-center">
				<p className="island-kicker">The science</p>
				<h2 id="science-heading" className="display-title font-bold text-3xl text-sea-ink">
					BMR → TDEE → your target
				</h2>
			</div>

			<div className="grid gap-6 sm:grid-cols-3">
				<ScienceCard
					step="Step A"
					title="Basal Metabolic Rate (BMR)"
					body="Your BMR is the number of calories your body burns at complete rest to keep basic functions running — breathing, circulation, cell repair. MacroMate calculates it with the Mifflin-St Jeor equation, the gold standard endorsed by most dietitians."
					formula="Men: (10 × kg) + (6.25 × cm) − (5 × age) + 5"
					formula2="Women: (10 × kg) + (6.25 × cm) − (5 × age) − 161"
				/>
				<ScienceCard
					step="Step B"
					title="Total Daily Energy Expenditure (TDEE)"
					body="Your TDEE is what you actually burn each day once movement and exercise are factored in. MacroMate multiplies your BMR by an activity factor that reflects how active your lifestyle is — from sedentary to extra-active."
					formula="TDEE = BMR × Activity Multiplier"
				/>
				<ScienceCard
					step="Step C"
					title="Goal adjustment"
					body="Your TDEE is your maintenance intake. MacroMate adjusts it based on your goal: a moderate deficit for fat loss, no change for maintenance, or a moderate surplus for muscle gain. The adjustment is intentionally conservative to avoid muscle loss or excessive fat gain."
					formula="Cut: TDEE − 500 kcal"
					formula2="Bulk: TDEE + 500 kcal"
				/>
			</div>
		</section>
	)
}

interface ScienceCardProps {
	step: string
	title: string
	body: string
	formula: string
	formula2?: string
}

function ScienceCard({step, title, body, formula, formula2}: ScienceCardProps) {
	return (
		<div className="feature-card island-shell space-y-4 rounded-xl border border-line p-6 transition-all">
			<p className="island-kicker">{step}</p>
			<h3 className="font-semibold text-base text-sea-ink">{title}</h3>
			<p className="text-sea-ink-soft text-sm leading-relaxed">{body}</p>
			<div className="space-y-1 rounded-lg bg-sand/60 px-4 py-3">
				<code className="border-0 bg-transparent p-0 font-mono text-palm text-xs">{formula}</code>
				{formula2 && (
					<code className="block border-0 bg-transparent p-0 font-mono text-palm text-xs">
						{formula2}
					</code>
				)}
			</div>
		</div>
	)
}

function Steps() {
	return (
		<section
			aria-labelledby="steps-heading"
			className="island-shell space-y-10 rounded-2xl border p-10"
		>
			<div className="space-y-2 text-center">
				<p className="island-kicker">Step by step</p>
				<h2 id="steps-heading" className="display-title font-bold text-3xl text-sea-ink">
					Four steps to your personalised plan
				</h2>
			</div>

			<div className="grid gap-8 sm:grid-cols-2">
				{STEPS.map(({number, title, description}) => (
					<div key={number} className="flex gap-5">
						<div className="shrink-0">
							<span
								className="display-title flex h-12 w-12 items-center justify-center rounded-full bg-sand font-bold text-sea-ink text-xl"
								aria-hidden="true"
							>
								{number}
							</span>
						</div>
						<div className="space-y-1.5">
							<div className="flex items-center gap-2">
								<IconComponent title={title} />
								<h3 className="font-semibold text-sea-ink">{title}</h3>
							</div>
							<p className="text-sea-ink-soft text-sm leading-relaxed">{description}</p>
						</div>
					</div>
				))}
			</div>
		</section>
	)
}

function IconComponent({title}: {title?: string}) {
	switch (title) {
		case "Enter your stats":
			return <StatsIcon className="h-5 w-5" />
		case "Pick your activity level":
			return <ActivityIcon className="h-5 w-5" />
		case "Set your goal":
			return <GoalIcon className="h-5 w-5" />
		case "Choose a diet preset":
			return <DietIcon className="h-5 w-5" />
		default:
			return <StatsIcon className="h-5 w-5" />
	}
}

function DietPresets() {
	return (
		<section aria-labelledby="presets-heading" className="space-y-8">
			<div className="space-y-2 text-center">
				<p className="island-kicker">Diet presets</p>
				<h2 id="presets-heading" className="display-title font-bold text-3xl text-sea-ink">
					Which macro split is right for you?
				</h2>
				<p className="mx-auto max-w-xl text-sea-ink-soft leading-relaxed">
					MacroMate offers four science-backed macro distributions. Pick the one that best matches
					your goal and lifestyle.
				</p>
			</div>

			<div className="grid gap-5 sm:grid-cols-2">
				{DIET_PRESETS.map(({name, split, best, description}) => (
					<div
						key={name}
						className="feature-card island-shell space-y-3 rounded-xl border border-line p-6 transition-all"
					>
						<div className="flex items-start justify-between gap-3">
							<h3 className="font-semibold text-sea-ink">{name}</h3>
							<span className="rounded-full bg-lagoon/10 px-2.5 py-0.5 font-medium text-lagoon-deep text-xs">
								{best}
							</span>
						</div>
						<p className="font-mono text-palm text-xs">{split}</p>
						<p className="text-sea-ink-soft text-sm leading-relaxed">{description}</p>
					</div>
				))}
			</div>
		</section>
	)
}

function ActivityTable() {
	return (
		<section aria-labelledby="activity-heading" className="mx-auto max-w-3xl space-y-6">
			<div className="space-y-2 text-center">
				<p className="island-kicker">Activity multipliers</p>
				<h2 id="activity-heading" className="display-title font-bold text-3xl text-sea-ink">
					How active are you, really?
				</h2>
				<p className="text-sea-ink-soft leading-relaxed">
					Most people underestimate their activity level — but overestimating it is just as common.
					Use the guide below to pick the multiplier that honestly reflects your typical week.
				</p>
			</div>

			<div className="island-shell overflow-hidden rounded-2xl border">
				<table className="w-full text-sm">
					<thead>
						<tr className="border-line border-b bg-sand/40">
							<th className="px-5 py-3 text-left font-semibold text-sea-ink">Level</th>
							<th className="px-5 py-3 text-left font-semibold text-sea-ink">Multiplier</th>
							<th className="px-5 py-3 text-left font-semibold text-sea-ink">Typical week</th>
						</tr>
					</thead>
					<tbody>
						{ACTIVITY_LEVELS.map(({level, multiplier, example}, i) => (
							<tr key={level} className={i % 2 === 0 ? "bg-surface/40" : "bg-transparent"}>
								<td className="px-5 py-3 font-medium text-sea-ink">{level}</td>
								<td className="px-5 py-3 font-mono text-palm">{multiplier}</td>
								<td className="px-5 py-3 text-sea-ink-soft">{example}</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</section>
	)
}

function FAQ() {
	return (
		<section aria-labelledby="faq-heading" className="mx-auto max-w-3xl space-y-6">
			<div className="space-y-2 text-center">
				<p className="island-kicker">FAQ</p>
				<h2 id="faq-heading" className="display-title font-bold text-3xl text-sea-ink">
					Common questions
				</h2>
			</div>

			<div className="space-y-4">
				{FAQS.map(({q, a}) => (
					<div key={q} className="island-shell rounded-xl border border-line p-6">
						<h3 className="mb-2 font-semibold text-sea-ink">{q}</h3>
						<p className="text-sea-ink-soft text-sm leading-relaxed">{a}</p>
					</div>
				))}
			</div>
		</section>
	)
}

function CTA() {
	return (
		<section className="rise-in mx-auto max-w-xl space-y-6 py-4 text-center">
			<p className="island-kicker">Ready?</p>
			<h2 className="display-title font-bold text-3xl text-sea-ink">
				Get your numbers in 60 seconds
			</h2>
			<p className="text-sea-ink-soft leading-relaxed">
				No account. No email. No fuss. Just your personalised calorie and macro targets, instantly.
			</p>
			<div className="flex flex-wrap justify-center gap-3 pt-2">
				<Button asChild size="lg">
					<Link to="/calculator">Calculate my macros →</Link>
				</Button>
				<Button asChild variant="outline" size="lg">
					<Link to="/">Back to home</Link>
				</Button>
			</div>
		</section>
	)
}
