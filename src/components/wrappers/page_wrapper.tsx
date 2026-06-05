import type {PropsWithChildren} from "react"
import {cn} from "#/lib/utils"

interface Props {
	fluid?: boolean
	className?: string
}

export function PageWrapper({children, className, fluid}: PropsWithChildren<Props>) {
	return <div className={cn(fluid ? "w-full" : "mx-auto max-w-7xl", className)}>{children}</div>
}
