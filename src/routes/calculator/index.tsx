import {type AnyFieldApi, formOptions, useForm} from "@tanstack/react-form"
import {createFileRoute} from "@tanstack/react-router"
import {Heading, Text} from "#/components/typography"
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
})

function RouteComponent() {
	const form = useForm({
		...opts,
		onSubmit: data => {
			// biome-ignore lint/suspicious/noConsole: <testing>
			console.log("submit", data.value)
		},
	})
	return (
		<PageWrapper>
			<Heading>Calculator</Heading>
			<Text>Coming soon..</Text>
			<fieldset>
				<legend>hello world</legend>
				<form
					onSubmit={e => {
						e.preventDefault()
						e.stopPropagation()
						form.handleSubmit()
					}}
				>
					<div>
						<form.Field
							name="unit"
							defaultValue="kg"
							validators={{
								onChange: ({value}) => {
									//
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
										<Select name={field.name}>
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
					</div>

					<RadioGroup defaultValue="female" className="flex gap-4 border border-red-400">
						<div className="flex items-center gap-3">
							<RadioGroupItem value="female" id="female" />
							<Label htmlFor="female">Female</Label>
						</div>
						<div className="flex items-center gap-3">
							<RadioGroupItem value="male" id="male" />
							<Label htmlFor="male">Male</Label>
						</div>
					</RadioGroup>
					{/*// Fields: `unit`, `sex`, `age`, `weightKg`, `heightCm`.*/}
					<Input type="number" placeholder="age" />
					<Input type="number" placeholder="weightKg" />
					<Input type="number" placeholder="heightCm" />
				</form>
			</fieldset>
		</PageWrapper>
	)
}

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
