export const STEP_ORDER = ["personal_details", "activity_level", "goal", "macros"] as const

export type Page = (typeof STEP_ORDER)[number]
