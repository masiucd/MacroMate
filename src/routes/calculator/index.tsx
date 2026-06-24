import {useStore} from "@tanstack/react-form"
import {createFileRoute, useNavigate} from "@tanstack/react-router"
import {useState} from "react"
import z from "zod"
import {ActivityLevel} from "#/components/form_views/activity_level"
import {Goal} from "#/components/form_views/goal"
import {Macros} from "#/components/form_views/macros"
import {PersonalDetails} from "#/components/form_views/personal_details"
import {NavigationButtons} from "#/components/navigation_buttons"
import {Heading, Text} from "#/components/typography"
import {Button} from "#/components/ui/button"
import {PageWrapper} from "#/components/wrappers/page_wrapper"
import {
	ACTIVITY_LEVELS,
	DIET_PRESET_VALUES,
	GOALS,
	SEXES,
	type StepWithValidation,
	UNITS,
	validateStep,
} from "#/features/calculator/schema"
import {useWizardForm, type WizardForm} from "./form"
import {type Page, STEP_ORDER} from "./types"

const calculatorSearchSchema = z.object({
	page: z.enum(STEP_ORDER).optional().catch(STEP_ORDER[0]),
	unit: z.enum(UNITS).optional().catch("metric"),
	sex: z.enum(SEXES).optional().catch("female"),
	age: z.number().int().min(0).optional().catch(undefined),
	weightKg: z.number().min(0).optional().catch(undefined),
	heightCm: z.number().min(0).optional().catch(undefined),
	activity: z.enum(ACTIVITY_LEVELS).optional().catch(undefined),
	goal: z.enum(GOALS).optional().catch(undefined),
	preset: z.enum(DIET_PRESET_VALUES).optional().catch(undefined),
	proteinPerKg: z.number().min(0).optional().catch(undefined),
	fatPct: z.number().min(0).max(1).optional().catch(undefined),
})

export const Route = createFileRoute("/calculator/")({
	component: RouteComponent,
	validateSearch: search => {
		return calculatorSearchSchema.parse(search)
	},
})

function RouteComponent() {
	// TODO now can be used as default values in form inputs, but we need to make sure that the form values are updated when the search params change
	const search = Route.useSearch()

	console.log("Search --> ", search)

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

function MacroWizard() {
	const form = useWizardForm()
	const [page, setPage] = useState<Page>(STEP_ORDER[0])

	const stepIndex = STEP_ORDER.indexOf(page)
	const prevPage = STEP_ORDER[stepIndex - 1]
	const nextPage = STEP_ORDER[stepIndex + 1]

	const values = useStore(form.store, state => state.values)
	const stepNumber = (stepIndex + 1) as StepWithValidation
	const result = validateStep(stepNumber, values)
	const canAdvance = result.ok
	const issues = result.ok ? [] : result.issues
	const navigate = useNavigate({from: Route.fullPath})
	console.log("values", values)
	return (
		<form
			className="flex flex-col gap-10"
			onSubmit={e => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
		>
			<StepView page={page} form={form} issues={issues} />
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
				{!nextPage && (
					<Button type="submit" disabled={!canAdvance}>
						Calculate
					</Button>
				)}
			</div>
		</form>
	)
}

function StepView({
	page,
	form,
	issues,
}: {
	page: Page
	form: WizardForm
	issues: z.core.$ZodIssue[]
}) {
	switch (page) {
		case "personal_details":
			return <PersonalDetails form={form} issues={issues} />
		case "activity_level":
			return <ActivityLevel form={form} issues={issues} />
		case "goal":
			return <Goal form={form} issues={issues} />
		case "macros":
			return <Macros form={form} issues={issues} />
	}
}
