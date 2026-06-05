import {createFileRoute} from "@tanstack/react-router"

export const Route = createFileRoute("/calculator")({component: Calculator})

function Calculator() {
	return (
		<div className="page-wrap py-16">
			<h1 className="display-title font-bold text-4xl" style={{color: "var(--sea-ink)"}}>
				Macro Calculator
			</h1>
			<p className="mt-4 text-lg" style={{color: "var(--sea-ink-soft)"}}>
				Coming soon…
			</p>
		</div>
	)
}
