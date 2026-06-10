import {type AnyFieldApi, formOptions, useForm} from "@tanstack/react-form"
import {createFileRoute} from "@tanstack/react-router"
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

const opts = formOptions({
	//
	// units: ["kg", "lbs"],
	defaultValues: {
		unit: "kg",
		sex: "female",
		age: "",
		weightKg: "",
		heightCm: "",
	},
	// validators: {},
})

function RouteComponent() {
	return (
		<PageWrapper>
			<div className="mb-10 flex flex-col gap-2">
				<Heading size="h1">Calculator</Heading>
				<Text variant="lead">Coming soon..</Text>
			</div>
			<MacroForm />
		</PageWrapper>
	)
}

function MacroForm() {
	const form = useForm({
		...opts,
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
				<div className="flex gap-4">
					<Button
						onClick={() => {
							// if on first page -->
							// if on second page -->
						}}
					>
						Prev
					</Button>
					<Button
						onClick={() => {
							// if on first page -->
							// if on second page -->
						}}
					>
						Next
					</Button>
				</div>
			</form>
		</fieldset>
	)
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
