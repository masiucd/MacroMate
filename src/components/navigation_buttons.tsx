import {Button} from "#/components/ui/button"

interface NavigationButtonsProps {
	moveForward: () => void
	moveBackward: () => void
	nextButtonDisabled: boolean
	prevButtonDisabled: boolean
}

export function NavigationButtons({
	moveForward,
	moveBackward,
	nextButtonDisabled,
	prevButtonDisabled,
}: NavigationButtonsProps) {
	return (
		<>
			<Button
				type="button"
				onClick={() => {
					moveBackward()
				}}
				disabled={prevButtonDisabled}
			>
				Prev
			</Button>
			<Button
				type="button"
				onClick={() => {
					moveForward()
				}}
				disabled={nextButtonDisabled}
			>
				Next
			</Button>
		</>
	)
}
