import {
	CircleAlert,
	ClipboardList,
	Copy,
	Dumbbell,
	Eye,
	Link2,
	ListCheck,
	type LucideProps,
	PencilLine,
	RotateCcw,
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

/** Copy to clipboard. */
export const CopyIcon = createIcon(Copy)

/** Copy shareable link. */
export const LinkIcon = createIcon(Link2)

/** Reset / start over. */
export const ResetIcon = createIcon(RotateCcw)

/** Edit / go back to inputs. */
export const EditIcon = createIcon(PencilLine)
