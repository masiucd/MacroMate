import {Input} from "#/components/ui/input"
import {Label} from "#/components/ui/label"
import {RadioGroup, RadioGroupItem} from "#/components/ui/radio-group"
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "#/components/ui/s../field_info
import {FieldInfo} from "./field_info"

export function PersonalDetails() {
	return (
		<div className="flex flex-col gap-2">
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
		</div>
	)
}
