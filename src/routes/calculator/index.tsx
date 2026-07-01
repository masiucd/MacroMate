import {useStore} from "@tanstack/react-form"
import {createFileRoute, useNavigate} from "@tanstack/react-router"
import {useEffect, useState} from "react"
import type z from "zod"
import {ActivityLevel} from "#/components/form_views/activity_level"
import {Goal} from "#/components/form_views/goal"
import {Macros} from "#/components/form_views/macros"
import {PersonalDetails} from "#/components/form_views/personal_details"
import {Result} from "#/components/form_views/result"
import {NavigationButtons} from "#/components/navigation_buttons"
import {Heading, Text} from "#/components/typography"
import {Button} from "#/components/ui/button"
import {PageWrapper} from "#/components/wrappers/page_wrapper"
import {type StepWithValidation, validateStep} from "#/features/calculator/schema"
import {useWizardForm, type WizardForm} from "./form"
import {type CalculatorSearchParams, calculatorSearchSchema, type Page, STEP_ORDER} from "./types"

export const Route = createFileRoute("/calculator/")({
	component: RouteComponent,
	validateSearch: search => {
		return calculatorSearchSchema.parse(search)
	},
})

function RouteComponent() {
	return (
		<PageWrapper>
			<div className="mb-10 flex flex-col gap-2">
				<Heading size="h1">Calculator</Heading>
				<Text variant="lead">
					Calculate your macros based on your personal details, activity level and goals.
				</Text>
			</div>
			<MacroWizard />
		</PageWrapper>
	)
}

// Form field keys that mirror search params (excludes `page`, which is wizard
// navigation state rather than a form value).
const SYNCED_KEYS = [
	"unit",
	"sex",
	"age",
	"weightKg",
	"heightCm",
	"activity",
	"goal",
	"preset",
	"proteinPerKg",
	"fatPct",
] as const

/**
 * Writes any defined search-param values into the form, skipping keys already
 * in sync so untouched fields keep their state. Only `undefined`-checked keys
 * are applied, so partial URLs never clobber existing values.
 */
function syncFormFromSearch(form: WizardForm, search: CalculatorSearchParams) {
	for (const key of SYNCED_KEYS) {
		const next = search[key]
		if (next !== undefined && next !== form.getFieldValue(key)) {
			form.setFieldValue(key, next)
		}
	}
}

function MacroWizard() {
	const search = Route.useSearch()
	const {page: _page, ...searchValues} = search
	const form = useWizardForm(searchValues)
	const [page, setPage] = useState<Page>(search.page ?? STEP_ORDER[0])

	// `defaultValues` only seed the form at mount, so re-sync whenever search
	// params change from outside the form (browser back/forward, shared links,
	// manual URL edits) — otherwise the URL and form drift apart.
	useEffect(() => {
		syncFormFromSearch(form, search)
		if (search.page) setPage(search.page)
	}, [search, form])

	const stepIndex = STEP_ORDER.indexOf(page)
	const prevPage = STEP_ORDER[stepIndex - 1]
	const nextPage = STEP_ORDER[stepIndex + 1]

	const values = useStore(form.store, state => state.values)
	const stepNumber = (stepIndex + 1) as StepWithValidation
	const result = validateStep(stepNumber, values)
	const canAdvance = result.ok
	const issues = result.ok ? [] : result.issues
	const navigate = useNavigate({from: Route.fullPath})

	console.log("nextPage", nextPage)

	return (
		<form
			className="flex flex-col gap-10 rounded-xl border border-line bg-surface p-5 md:p-6"
			onSubmit={e => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
		>
			<StepView page={page} form={form} issues={issues} searchParams={search} />
			<div className="flex gap-4">
				<NavigationButtons
					moveBackward={() => {
						if (prevPage) {
							setPage(prevPage)
							navigate({
								search: prev => ({
									...prev,
									page: prevPage,
									...values,
								}),
							})
						}
					}}
					moveForward={() => {
						if (nextPage) {
							setPage(nextPage)
							navigate({
								search: prev => ({
									...prev,
									page: nextPage,
									...values,
								}),
							})
						}
					}}
					prevButtonDisabled={prevPage === undefined}
					nextButtonDisabled={!canAdvance || nextPage === undefined}
				/>

				<Button type="submit" disabled={!canAdvance}>
					Calculate
				</Button>
			</div>
		</form>
	)
}

interface StepViewProps {
	page: Page
	form: WizardForm
	issues: z.core.$ZodIssue[]
	searchParams: CalculatorSearchParams
}

function StepView({page, form, issues, searchParams}: StepViewProps) {
	switch (page) {
		case "personal_details":
			return <PersonalDetails form={form} issues={issues} searchParams={searchParams} />
		case "activity_level":
			return <ActivityLevel form={form} issues={issues} searchParams={searchParams} />
		case "goal":
			return <Goal form={form} issues={issues} searchParams={searchParams} />
		case "macros":
			return <Macros form={form} issues={issues} searchParams={searchParams} />
		case "result":
			// TODO need to work on the result view
			return <Result form={form} issues={issues} searchParams={searchParams} />
		default:
			throw new Error(`Unknown page: ${page}`)
	}
}
