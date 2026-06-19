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
} from "#/components/ui/select"
import type {WizardForm} from "../../form"
import {FieldInfo} from "../field_info"

export function PersonalDetails({form}: {form: WizardForm}) {
	return (
		<div className="flex flex-col gap-2">
			<div className="flex gap-2">
				<form.Field
					name="unit"
					validators={{
						onChange: ({value}) => (value ? undefined : "Unit is required"),
					}}
					children={field => (
						<>
							<Select
								name={field.name}
								value={field.state.value}
								onValueChange={v => field.handleChange(v as "metric" | "imperial")}
							>
								<SelectTrigger className="w-45">
									<SelectValue placeholder="Unit" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										<SelectItem value="metric">Metric (kg / cm)</SelectItem>
										<SelectItem value="imperial">Imperial (lb / in)</SelectItem>
									</SelectGroup>
								</SelectContent>
							</Select>
							<FieldInfo field={field} />
						</>
					)}
				/>

				<form.Field
					name="sex"
					children={field => (
						<>
							<RadioGroup
								value={field.state.value}
								onValueChange={v => field.handleChange(v as "male" | "female")}
								className="flex gap-4"
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
					)}
				/>
			</div>

			<form.Field
				name="age"
				validators={{
					onBlur: ({value}) => (value === undefined ? "Age is required" : undefined),
				}}
				children={field => (
					<div>
						<Label htmlFor={field.name}>Age</Label>
						<Input
							id={field.name}
							type="number"
							inputMode="numeric"
							placeholder="e.g. 32"
							value={field.state.value ?? ""}
							onBlur={field.handleBlur}
							onChange={e => {
								const v = e.target.value
								field.handleChange(v === "" ? undefined : Number(v))
							}}
						/>
						<FieldInfo field={field} />
					</div>
				)}
			/>

			<form.Field
				name="weightKg"
				validators={{
					onBlur: ({value}) => (value === undefined ? "Weight is required" : undefined),
				}}
				children={field => (
					<div>
						<Label htmlFor={field.name}>
							Weight ({form.getFieldValue("unit") === "metric" ? "kg" : "lb"})
						</Label>
						<Input
							id={field.name}
							type="number"
							inputMode="decimal"
							placeholder="Weight"
							value={field.state.value ?? ""}
							onBlur={field.handleBlur}
							onChange={e => {
								const v = e.target.value
								field.handleChange(v === "" ? undefined : Number(v))
							}}
						/>
						<FieldInfo field={field} />
					</div>
				)}
			/>

			<form.Field
				name="heightCm"
				validators={{
					onBlur: ({value}) => (value === undefined ? "Height is required" : undefined),
				}}
				children={field => (
					<div>
						<Label htmlFor={field.name}>Height (cm)</Label>
						<Input
							id={field.name}
							type="number"
							inputMode="decimal"
							placeholder="Height (cm)"
							value={field.state.value ?? ""}
							onBlur={field.handleBlur}
							onChange={e => {
								const v = e.target.value
								field.handleChange(v === "" ? undefined : Number(v))
							}}
						/>
						<FieldInfo field={field} />
					</div>
				)}
			/>
		</div>
	)
}
