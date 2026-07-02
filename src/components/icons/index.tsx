import {
	CircleAlert,
	ClipboardList,
	Dumbbell,
	Eye,
	ListCheck,
	type LucideProps,
	Salad,
	Target,
} from "lucide-react"
import type {ComponentType} from "react"

type IconProps = Pick<LucideProps, "size" | "className">

function createIcon(Icon: ComponentType<LucideProps>) {
	return ({size = 20, className}: IconProps) => (
		<Icon size={size} className={className} role="img" />
	)
}

/** "Enter your stats" */
export const StatsIcon = createIcon(ClipboardList)

/** "Pick your activity level" */
export const ActivityIcon = createIcon(Dumbbell)

/** "Set your goal" */
export const GoalIcon = createIcon(Target)

/** "Choose diet preset" */
export const DietIcon = createIcon(Salad)

/** Inline alert/warning indicator. */
export const AlertIcon = createIcon(CircleAlert)

/** Inline checkmark indicator. */
export const CheckIcon = createIcon(ListCheck)

/** Inline eye/visibility indicator. */
export const EyeIcon = createIcon(Eye)
