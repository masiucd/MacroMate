export type Sex = "male" | "female"
export type ActivityLevel = "sedentary" | "light" | "moderate" | "very" | "extra"
export type Goal = "cut" | "maintain" | "bulk"
export type DietPreset = "balanced" | "high-protein" | "low-carb" | "keto"

export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
	sedentary: 1.2,
	light: 1.375,
	moderate: 1.55,
	very: 1.725,
	extra: 1.9,
}

export const GOAL_DELTAS: Record<Goal, number> = {
	cut: -0.2,
	maintain: 0,
	bulk: 0.15,
}

export const DIET_PRESETS: Record<DietPreset, {proteinPerKg: number; fatPct: number}> = {
	balanced: {proteinPerKg: 1.6, fatPct: 0.3},
	"high-protein": {proteinPerKg: 2.2, fatPct: 0.25},
	"low-carb": {proteinPerKg: 1.8, fatPct: 0.5},
	keto: {proteinPerKg: 1.8, fatPct: 0.7},
}

export const KCAL_PER_G = {protein: 4, carbs: 4, fat: 9} as const

export const BOUNDS = {
	ageMin: 14,
	ageMax: 100,
	weightKgMin: 30,
	weightKgMax: 300,
	heightCmMin: 100,
	heightCmMax: 250,
} as const

const LB_PER_KG = 0.45359237
const CM_PER_IN = 2.54

export const lbToKg = (lb: number): number => lb * LB_PER_KG
export const kgToLb = (kg: number): number => kg / LB_PER_KG

export const ftInToCm = (ft: number, inches: number): number => (ft * 12 + inches) * CM_PER_IN

export const cmToFtIn = (cm: number): {ft: number; inches: number} => {
	const totalInches = cm / CM_PER_IN
	const ft = Math.floor(totalInches / 12)
	const inches = totalInches - ft * 12
	return {ft, inches}
}

export function bmr(input: {
	sex: Sex
	weightKg: number
	heightCm: number
	age: number
}): number {
	const {sex, weightKg, heightCm, age} = input
	const base = 10 * weightKg + 6.25 * heightCm - 5 * age
	return base + (sex === "male" ? 5 : -161)
}

export function tdee(bmrValue: number, activity: ActivityLevel): number {
	return bmrValue * ACTIVITY_MULTIPLIERS[activity]
}

export function kcalForGoal(tdeeValue: number, goal: Goal): number {
	return tdeeValue * (1 + GOAL_DELTAS[goal])
}

export type MacroSplit = {
	kcal: number
	proteinG: number
	carbsG: number
	fatG: number
	proteinPct: number
	carbsPct: number
	fatPct: number
	isFeasible: boolean
}

export function splitMacros(input: {
	kcal: number
	weightKg: number
	proteinPerKg: number
	fatPct: number
}): MacroSplit {
	const {kcal, weightKg, proteinPerKg, fatPct} = input
	const proteinG = proteinPerKg * weightKg
	const proteinKcal = proteinG * KCAL_PER_G.protein
	const fatKcal = kcal * fatPct
	const fatG = fatKcal / KCAL_PER_G.fat
	const carbsKcalRaw = kcal - proteinKcal - fatKcal
	const isFeasible = carbsKcalRaw >= 0
	const carbsKcal = Math.max(0, carbsKcalRaw)
	const carbsG = carbsKcal / KCAL_PER_G.carbs
	return {
		kcal,
		proteinG,
		carbsG,
		fatG,
		proteinPct: proteinKcal / kcal,
		carbsPct: carbsKcal / kcal,
		fatPct: fatKcal / kcal,
		isFeasible,
	}
}
