import {createFileRoute, Link} from "@tanstack/react-router"
import {Button} from "#/components/ui/button"
import {appConfig} from "#/config/app"

export const Route = createFileRoute("/")({component: Home})

const FEATURES = [
	{
		icon: "🔥",
		title: "BMR & TDEE",
		description:
			"Calculates your Basal Metabolic Rate and Total Daily Energy Expenditure using the Mifflin-St Jeor formula, adjusted for your activity level.",
	},
	{
		icon: "🎯",
		title: "Goal-based calories",
		description:
			"Whether you're cutting, maintaining, or bulking, get a precise daily calorie target tailored to your goal.",
	},
	{
		icon: "🥗",
		title: "Macro splits",
		description:
			"Choose from Balanced, High-Protein, Low-Carb, or Keto diet presets and get your exact protein, carbs, and fat targets in grams.",
	},
	{
		icon: "📐",
		title: "Any unit system",
		description:
			"Enter your stats in metric (kg / cm) or imperial (lb / ft+in) — MacroMate converts everything behind the scenes.",
	},
] as const

const STEPS = [
	{number: "01", label: "Enter your stats", detail: "Age, sex, weight & height"},
	{number: "02", label: "Pick your activity", detail: "Sedentary to extra-active"},
	{number: "03", label: "Set your goal", detail: "Cut · Maintain · Bulk"},
	{number: "04", label: "Choose a diet preset", detail: "Balanced, High-Protein, Low-Carb or Keto"},
] as const

function Home() {
	return (
		<div className="page-wrap space-y-24 py-16">
			{/* ── Hero ── */}
			<section className="rise-in mx-auto max-w-2xl space-y-6 text-center">
				<p className="island-kicker">Free · No account needed</p>
				<h1 className="display-title font-bold text-5xl text-sea-ink leading-tight sm:text-6xl">
					Know your macros.
					<br />
					<span>Fuel your goals.</span>
				</h1>
				<p className="text-lg leading-relaxed">
					{appConfig.described} Enter your stats once and get a personalized calorie target with a
					full protein, carb, and fat breakdown — instantly.
				</p>
				<div className="flex flex-wrap justify-center gap-3 pt-2">
					<Button asChild variant="link">
						<Link to="/calculator">Calculate my macros →</Link>
					</Button>

					<Button asChild variant="link">
						<Link to="/how_it_works">How It Works</Link>
					</Button>
				</div>
			</section>

			<FeatureCards />

			<HowItWorks />

			<FooterNote />
		</div>
	)
}

function FeatureCards() {
	return (
		<section aria-labelledby="features-heading" className="space-y-8">
			<div className="space-y-2 text-center">
				<p className="island-kicker">What's included</p>
				<h2 id="features-heading" className="display-title font-bold text-3xl text-sea-ink">
					Everything you need, nothing you don't
				</h2>
			</div>
			<ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
				{FEATURES.map(({icon, title, description}) => (
					<li
						key={title}
						className="feature-card island-shell space-y-3 rounded-xl border border-line p-6 transition-all"
					>
						<span className="text-3xl" role="img" aria-hidden="true">
							{icon}
						</span>
						<h3 className="font-semibold text-base text-sea-ink">{title}</h3>
						<p className="text-sea-ink-soft text-sm leading-relaxed">{description}</p>
					</li>
				))}
			</ul>
		</section>
	)
}

function FooterNote() {
	return (
		<footer className="site-footer -mx-4 px-4 py-6 text-center text-xs">
			<p>
				Built by{" "}
				<a href={appConfig.meta.socialMedia.website.url} target="_blank" rel="noopener noreferrer">
					{appConfig.meta.socialMedia.twitter.handle}
				</a>{" "}
				· Source on{" "}
				<a href={appConfig.meta.socialMedia.github.url} target="_blank" rel="noopener noreferrer">
					GitHub
				</a>
			</p>
		</footer>
	)
}

function HowItWorks() {
	return (
		<section
			id="how-it-works"
			aria-labelledby="steps-heading"
			className="island-shell space-y-8 rounded-2xl border p-10"
		>
			<div className="space-y-2 text-center">
				<p className="island-kicker">How it works</p>
				<h2 id="steps-heading" className="display-title font-bold text-3xl">
					Four steps to your plan
				</h2>
			</div>
			<ol className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 lg:grid-cols-4">
				{STEPS.map(({number, label, detail}) => (
					<li key={number} className="space-y-2">
						<span className="display-title font-bold text-4xl">{number}</span>
						<p className="font-semibold text-sm">{label}</p>
						<p className="text-xs">{detail}</p>
					</li>
				))}
			</ol>
			<div className="pt-5 text-center">
				<Button asChild variant="link">
					<Link to="/calculator">Get started →</Link>
				</Button>
			</div>
		</section>
	)
}
