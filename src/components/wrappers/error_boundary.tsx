import {Component, type ErrorInfo, type PropsWithChildren, type ReactNode} from "react"
import {AlertIcon} from "#/components/icons"
import {Text} from "#/components/typography"

interface State {
	error: Error | null
}

interface Props extends PropsWithChildren {
	/** Optional custom fallback rendered instead of the default error UI. */
	fallback?: (error: Error, reset: () => void) => ReactNode
}

/**
 * Catches unhandled render errors anywhere in the subtree and replaces the
 * crashed region with a friendly message. Provides a "Try again" button that
 * resets the boundary so the user can retry without a full page reload.
 */
export class ErrorBoundary extends Component<Props, State> {
	state: State = {error: null}

	static getDerivedStateFromError(error: Error): State {
		return {error}
	}

	componentDidCatch(error: Error, info: ErrorInfo) {
		console.error("[ErrorBoundary]", error, info.componentStack)
	}

	reset = () => this.setState({error: null})

	render() {
		const {error} = this.state
		if (!error) return this.props.children

		if (this.props.fallback) return this.props.fallback(error, this.reset)

		return (
			<div className="flex flex-col gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-4">
				<div className="flex items-center gap-2">
					<span className="shrink-0 text-destructive">
						<AlertIcon size={18} />
					</span>
					<Text variant="small" className="text-destructive">
						Something went wrong
					</Text>
				</div>
				<Text variant="muted">{error.message}</Text>
				<button
					type="button"
					onClick={this.reset}
					className="self-start text-sm underline underline-offset-2 hover:text-sea-ink"
				>
					Try again
				</button>
			</div>
		)
	}
}
