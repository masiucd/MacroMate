import {createFileRoute} from "@tanstack/react-router"
import {useState} from "react"
import {Heading, Text} from "#/components/typography"
import {Button} from "#/components/ui/button"
import {PageWrapper} from "#/components/wrappers/page_wrapper"
import {ActivityLevel} from "./components/form_views/activity_level"
import {Goal} from "./components/form_views/goal"
import {Macros} from "./components/form_views/macros"
import {PersonalDetails} from "./components/form_views/personal_details"
import {NavigationButtons} from "./components/navigation_buttons"
import {useWizardForm, type WizardForm} from "./form"
import {type Page, STEP_ORDER} from "./types"

export const Route = createFileRoute("/calculator/")({
	component: RouteComponent,
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

const initialPage = STEP_ORDER[0]

function MacroWizard() {
	const form = useWizardForm()
	const [page, setPage] = useState<Page>(initialPage)

	const stepOrderIndex = STEP_ORDER.indexOf(page)
	const prev = STEP_ORDER[stepOrderIndex - 1]
	const next = STEP_ORDER[stepOrderIndex + 1]

	return (
		<form
			className="flex flex-col gap-10"
			onSubmit={e => {
				e.preventDefault()
				e.stopPropagation()
				form.handleSubmit()
			}}
		>
			<StepView page={page} form={form} />
			<div className="flex gap-4">
				<NavigationButtons
					moveBackward={() => prev && setPage(prev)}
					moveForward={() => next && setPage(next)}
					backwardButtonEnabled={prev !== undefined}
					forwardButtonEnabled={next !== undefined}
				/>
				{next === undefined && <Button type="submit">Save</Button>}
			</div>
		</form>
	)
}

function StepView({page, form}: {page: Page; form: WizardForm}) {
	switch (page) {
		case "personal_details":
			return <PersonalDetails form={form} />
		case "activity_level":
			return <ActivityLevel form={form} />
		case "goal":
			return <Goal form={form} />
		case "macros":
			return <Macros form={form} />
	}
}
