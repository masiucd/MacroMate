import {createFileRoute} from "@tanstack/react-router"
import {useState} from "react"
import {Heading, Text} from "#/components/typography"
import {PageWrapper} from "#/components/wrappers/page_wrapper"

import {NavigationButtons} from "./components/navigation_buttons"
import type {Page} from "./types"

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

// function _reducer() {
// 	//
// }

const initialPage: Page = "personal_details"
function MacroWizard() {
	const [page, setPage] = useState<Page>(initialPage)
	const [_state, _setState] = useState({
		unit: "kg",
		sex: "female",
		age: "",
		weightKg: "",
		heightCm: "",
		//
	})
	return (
		<div className="flex flex-col gap-10 bg-red-300">
			<FormComponent page={page} />
			<div className="flex gap-4">
				<NavigationButtons
					moveForward={() => {
						if (page === "personal_details") {
							setPage("activity_level")
						} else if (page === "activity_level") {
							setPage("goal")
						} else if (page === "goal") {
							setPage("macros")
						}
					}}
					moveBackward={() => {
						if (page === "personal_details") {
							return
						} else if (page === "activity_level") {
							setPage("personal_details")
						} else if (page === "goal") {
							setPage("activity_level")
						} else if (page === "macros") {
							setPage("goal")
						}
					}}
					forwardButtonEnabled={page !== "macros"}
					backwardButtonEnabled={page !== "personal_details"}
				/>
			</div>
		</div>
	)
}

export function FormComponent({page}: {page: Page}) {
	const _form = useForm({
		...formOpts,
		onSubmit: data => {
			console.log("submit", data.value)
		},
	})

	return (
		<form>
			<FormView page={page} />
			<Button>Save</Button>
		</form>
	)
}

const formOpts = formOptions({
	defaultValues: {
		unit: "kg",
		sex: "female",
		age: "",
		weightKg: "",
		heightCm: "",
		activity: "",
		goal: "",
		preset: "",
		proteinPerKg: "",
		fatPct: "",
	},
	// validators: {},
})

function FormView({page}: {page: Page}) {
	switch (page) {
		case "personal_details":
			return <PersonalDetails />
		case "activity_level":
			return <ActivityLevel />
		case "goal":
			return <Goal />
		case "macros":
			return <Macros />
		default:
			return null
	}
}
