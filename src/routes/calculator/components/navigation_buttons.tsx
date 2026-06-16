import {Button} from "#/components/ui/button"

interface NavigationButtonsProps {
	moveForward: () => void
	moveBackward: () => void
	forwardButtonEnabled: boolean
	backwardButtonEnabled: boolean
}

export function NavigationButtons({
	moveForward,
	moveBackward,
	forwardButtonEnabled,
	backwardButtonEnabled,
}: NavigationButtonsProps) {
	return (
		<>
			<Button
				onClick={() => {
					moveBackward()
				}}
				disabled={!backwardButtonEnabled}
			>
				Prev
			</Button>
			<Button
				onClick={() => {
					moveForward()
				}}
				disabled={!forwardButtonEnabled}
			>
				Next
			</Button>
		</>
	)
}
