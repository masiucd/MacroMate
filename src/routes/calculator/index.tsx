import {type AnyFieldApi, formOptions, useForm} from "@tanstack/react-form"
import {createFileRoute} from "@tanstack/react-router"
import {useState} from "react"
import {Heading, Text} from "#/components/typography"
import {Button} from "#/components/ui/button"
import {Input} from "#/components/ui/input"
import {Label} from "#/components/ui/label"
import {RadioGroup, RadioGroupItem} from "#/components/ui/radio-group"
import {PageWrapper} from "#/components/wrappers/page_wrapper"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/calculator/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<PageWrapper>
			<div className="mb-10 flex flex-col gap-2">
				<Heading size="h1">Calculator</Heading>
				<Text variant="lead">Coming soon..</Text>
			</div>
			<MacroWizard />
		</PageWrapper>
	)
}

type Page = "personal_details" | "activity_level" | "goal" | "macros"

function FormComponent({page}: {page: Page}) {
	if (page === "personal_details") {
		return <PersonalDetailsForm />
	} else if (page === "activity_level") {
		return (
			<form>
				<p>Activity level</p>
			</form>
		)
	} else if (page === "goal") {
		return (
			<form>
				<p>Goal</p>
			</form>
		)
	}
	return null
}

// TODO: We need to implement validation for each form and only allow going to the next step if the current form is valid
// Validation functions need to return a boolean indicating whether the form is valid or not
function _personalDetailsFormIsValid(fields: {
	unit: string
	// sex: "male" | "female"
	age: string
	weightKg: string
	heightCm: string
}) {
	return Object.values(fields).every(value => {
		if (typeof value === "string") {
			return value.trim() !== ""
		}
		return true
	})
}

function _activityLevelFormIsValid(fields: {activity: string}) {
	return fields.activity.trim() !== ""
}

function _goalFormIsValid(field: "cut" | "maintain" | "bulk") {
	return field.trim() !== "" && ["cut", "maintain", "bulk"].includes(field)
}

// TODO: We need to know what form to render depending on what step we are on
// Step 1 — Personal Details
// Step 2 — Activity Level
// Step 3 — Goal
//

const initialPage: Page = "personal_details"
function MacroWizard() {
	const [page, setPage] = useState<Page>(initialPage)

	return (
		<>
			<FormComponent page={page} />
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
			/>
		</>
	)
}

function NavigationButtons({
	moveForward,
	moveBackward,
}: {
	moveForward: () => void
	moveBackward: () => void
}) {
	return (
		<div className="flex gap-4">
			<Button
				onClick={() => {
					// TODO validation needs to bee added before going to the next step
					moveBackward()
				}}
			>
				Prev
			</Button>
			<Button
				onClick={() => {
					// TODO validation needs to bee added before going to the next step
					moveForward()
				}}
			>
				Next
			</Button>
		</div>
	)
}

const personalDetailsOptions = formOptions({
	defaultValues: {
		unit: "kg",
		sex: "female",
		age: "",
		weightKg: "",
		heightCm: "",
	},
	// validators: {},
})

function PersonalDetailsForm() {
	const form = useForm({
		...personalDetailsOptions,
		onSubmit: data => {
			console.log("submit", data.value)
		},
	})
	console.log("form", form.fieldInfo)
	return (
		<fieldset>
			<legend>
				<Heading>Enter your stats</Heading>
			</legend>

			<form
				onSubmit={e => {
					e.preventDefault()
					e.stopPropagation()
					form.handleSubmit()
				}}
				className="flex flex-col gap-2"
			>
				<div className="flex gap-2">
					<form.Field
						name="unit"
						defaultValue="kg"
						validators={{
							onChange: ({value}) => {
								// biome-ignore lint/suspicious/noConsole: <explanation>
								console.log("Value", value)
								if (!value) {
									return "Unit is required"
								}
							},
							onChangeAsyncDebounceMs: 500,
							onChangeAsync: async ({value}) => {
								// biome-ignore lint/suspicious/noConsole: <testing>
								console.log("unit changed", value)
								await new Promise(resolve => setTimeout(resolve, 1000))
								return value.includes("error") && 'No "error" allowed in first name'
							},
						}}
						children={field => {
							return (
								<>
									<Select
										name={field.name}
										// id={field.name}
										defaultValue={field.state.value}
										value={field.state.value}
										// onBlur={field.handleBlur}
										onValueChange={v => {
											console.log("v", v)
											field.handleChange(v)
											// onChange={(e) => field.handleChange(e.target.value)}
										}}
									>
										<SelectTrigger className="w-45">
											<SelectValue placeholder="Unit" />
										</SelectTrigger>
										<SelectContent>
											<SelectGroup>
												<SelectItem value="kg">Kg</SelectItem>
												<SelectItem value="lbs">Lbs</SelectItem>
											</SelectGroup>
										</SelectContent>
									</Select>
									<FieldInfo field={field} />
								</>
							)
						}}
					/>

					<form.Field
						name="sex"
						defaultValue="female"
						children={field => {
							return (
								<>
									<RadioGroup
										defaultValue={field.state.value}
										onValueChange={v => field.handleChange(v)}
										className="flex gap-4 border border-red-400"
									>
										<div className="flex items-center gap-3">
											<RadioGroupItem value="female" id="female" />
											<Label htmlFor="female">Female</Label>
										</div>
										<div className="flex items-center gap-3">
											<RadioGroupItem value="male" id="male" />
											<Label htmlFor="male">Male</Label>
										</div>
									</RadioGroup>
									<FieldInfo field={field} />
								</>
							)
						}}
					/>
				</div>

				<form.Field
					name="age"
					// defaultValue=""
					validators={{
						onBlur: ({value}) => {
							if (!value) {
								return "Age is required"
							}
							if (Number.isNaN(Number(value))) {
								return "Age must be a number"
							}
						},
					}}
					children={field => {
						return (
							<div>
								<Label htmlFor={field.name}>Age</Label>
								<Input
									type="number"
									placeholder="Age"
									value={field.state.value}
									// onChange={e => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								<FieldInfo field={field} />
							</div>
						)
					}}
				/>

				<form.Field
					name="weightKg"
					// defaultValue=""
					validators={{
						onBlur: ({value}) => {
							if (!value) {
								return "Weight is required"
							}
							if (Number.isNaN(Number(value))) {
								return "Weight must be a number"
							}
						},
					}}
					children={field => {
						return (
							<div>
								<Label htmlFor={field.name}>Weight ({field.form.getFieldValue("unit")})</Label>
								<Input
									type="number"
									placeholder="Weight (kg)"
									value={field.state.value}
									// onChange={e => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								<FieldInfo field={field} />
							</div>
						)
					}}
				/>

				<form.Field
					name="heightCm"
					// defaultValue=""
					validators={{
						onBlur: ({value}) => {
							if (!value) {
								return "Height is required"
							}
							if (Number.isNaN(Number(value))) {
								return "Height must be a number"
							}
						},
					}}
					children={field => {
						return (
							<div>
								<Label htmlFor={field.name}>Height (cm)</Label>
								<Input
									type="number"
									placeholder="Height (cm)"
									value={field.state.value}
									// onChange={e => field.handleChange(e.target.value)}
									onBlur={field.handleBlur}
								/>
								<FieldInfo field={field} />
							</div>
						)
					}}
				/>
			</form>
		</fieldset>
	)
}

function _PersonalInfoForm() {
	return <form></form>
}

// {/*// Fields: `unit`, `sex`, `age`, `weightKg`, `heightCm`.*/}

function FieldInfo({field}: {field: AnyFieldApi}) {
	return (
		<>
			{field.state.meta.isTouched && !field.state.meta.isValid ? (
				<em>{field.state.meta.errors.join(",")}</em>
			) : null}
			{field.state.meta.isValidating ? "Validating..." : null}
		</>
	)
}
