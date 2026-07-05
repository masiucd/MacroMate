import type {PropsWithChildren} from "react"
import {cn} from "#/lib/utils"

interface Props {
	fluid?: boolean
	className?: string
}

export function PageWrapper({children, className, fluid}: PropsWithChildren<Props>) {
	return (
		<div
			className={cn(
				"min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8",
				fluid ? "w-full" : "mx-auto max-w-7xl",
				className,
			)}
		>
			{children}
		</div>
	)
}
