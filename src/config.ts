export const FEATURES = [
	{
		icon: "🔥",
		title: "BMR & TDEE",
		description:
			"Calculates your Basal Metabolic Rate and Total Daily Energy Expenditure using the Mifflin-St Jeor formula, adjusted for your activity level.",
	},
	{
		icon: "🎯",
		title: "Goal-based calories",
		description:
			"Whether you're cutting, maintaining, or bulking, get a precise daily calorie target tailored to your goal.",
	},
	{
		icon: "🥗",
		title: "Macro splits",
		description:
			"Choose from Balanced, High-Protein, Low-Carb, or Keto diet presets and get your exact protein, carbs, and fat targets in grams.",
	},
	{
		icon: "📐",
		title: "Any unit system",
		description:
			"Enter your stats in metric (kg / cm) or imperial (lb / ft+in) — MacroMate converts everything behind the scenes.",
	},
] as const

export const STEPS = [
	{number: "01", label: "Enter your stats", detail: "Age, sex, weight & height"},
	{number: "02", label: "Pick your activity", detail: "Sedentary to extra-active"},
	{number: "03", label: "Set your goal", detail: "Cut · Maintain · Bulk"},
	{number: "04", label: "Choose a diet preset", detail: "Balanced, High-Protein, Low-Carb or Keto"},
] as const

export type StepItem = (typeof STEPS)[number]
