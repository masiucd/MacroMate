import {createFileRoute, Link} from "@tanstack/react-router"

import {Button} from "#/components/ui/button"
import {PageWrapper} from "#/components/wrappers/page_wrapper"
import {FEATURES, STEPS, type StepItem} from "#/config"
import {appConfig} from "#/config/app"

export const Route = createFileRoute("/")({component: Home})

function Home() {
	return (
		<PageWrapper className="page-wrap space-y-24 py-16">
			<Hero />
			<FeatureCards />
			<HowItWorks />
			<FooterNote />
		</PageWrapper>
	)
}

function Hero() {
	return (
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
				{FEATURES.map(f => (
					<FeatureListItem key={f.title} feature={f} />
				))}
			</ul>
		</section>
	)
}

function FeatureListItem({feature}: {feature: (typeof FEATURES)[number]}) {
	return (
		<li className="feature-card island-shell space-y-3 rounded-xl border border-line p-6 transition-all">
			<span className="text-3xl" role="img" aria-hidden="true">
				{feature.icon}
			</span>
			<h3 className="font-semibold text-base text-sea-ink">{feature.title}</h3>
			<p className="text-sea-ink-soft text-sm leading-relaxed">{feature.description}</p>
		</li>
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
				{STEPS.map(step => (
					<ListStepItem key={step.number} step={step} />
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

function ListStepItem({step}: {step: StepItem}) {
	return (
		<li className="space-y-2">
			<span className="display-title font-bold text-4xl">{step.number}</span>
			<p className="font-semibold text-sm">{step.label}</p>
			<p className="text-xs">{step.detail}</p>
		</li>
	)
}
