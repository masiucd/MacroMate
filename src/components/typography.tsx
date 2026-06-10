import {cva, type VariantProps} from "class-variance-authority"
import type {ElementType, PropsWithChildren} from "react"
import {cn} from "#/lib/utils"

const headingVariants = cva("scroll-m-20 font-display text-sea-ink tracking-tight", {
	variants: {
		size: {
			h1: "text-balance font-bold text-4xl",
			h2: "border-line border-b pb-2 font-semibold text-3xl first:mt-0",
			h3: "font-semibold text-2xl",
			h4: "font-semibold text-xl",
		},
	},
	defaultVariants: {
		size: "h2",
	},
})

type HeadingTag = "h1" | "h2" | "h3" | "h4"

interface HeadingProps extends VariantProps<typeof headingVariants> {
	/** The HTML element to render. Defaults to `h2`. */
	as?: HeadingTag
	/**
	 * Visual size, independent of the rendered element.
	 * Defaults to match `as` so semantic and visual scales stay in sync.
	 */
	size?: HeadingTag
	className?: string
	children?: React.ReactNode
}

export function Heading({children, as: Tag = "h2", size, className}: HeadingProps) {
	return <Tag className={cn(headingVariants({size: size ?? Tag}), className)}>{children}</Tag>
}

export {headingVariants}

// ─── Text ─────────────────────────────────────────────────────────────────────

const textVariants = cva("", {
	variants: {
		variant: {
			p: "not-first:mt-3 text-sea-ink leading-7",
			lead: "text-sea-ink-soft text-xl leading-7",
			large: "block font-semibold text-lg text-sea-ink",
			small: "font-medium text-sea-ink text-sm leading-none",
			muted: "text-sea-ink-soft text-sm",
		},
	},
	defaultVariants: {
		variant: "p",
	},
})

/** Default HTML element for each text variant. */
const TEXT_DEFAULT_TAG: Record<NonNullable<TextVariant>, ElementType> = {
	p: "p",
	lead: "p",
	large: "span",
	small: "small",
	muted: "p",
}

type TextVariant = VariantProps<typeof textVariants>["variant"]

interface TextProps extends VariantProps<typeof textVariants> {
	/** Override the rendered HTML element. */
	as?: ElementType
	className?: string
	children?: React.ReactNode
}

export function Text({children, variant = "p", as, className}: TextProps) {
	const Tag = as ?? TEXT_DEFAULT_TAG[variant ?? "p"]
	return <Tag className={cn(textVariants({variant}), className)}>{children}</Tag>
}

export {textVariants}

// ─── Inline utilities ─────────────────────────────────────────────────────────

export function InlineCode({children, className}: PropsWithChildren<{className?: string}>) {
	return (
		<code
			className={cn(
				"relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono font-semibold text-sm",
				className,
			)}
		>
			{children}
		</code>
	)
}

export function Blockquote({children, className}: PropsWithChildren<{className?: string}>) {
	return (
		<blockquote
			className={cn("mt-6 border-lagoon border-l-2 pl-6 text-sea-ink-soft italic", className)}
		>
			{children}
		</blockquote>
	)
}

export function Table({children, className}: PropsWithChildren<{className?: string}>) {
	return (
		<div className={cn("my-6 w-full overflow-y-auto", className)}>
			<table className="w-full">{children}</table>
		</div>
	)
}

export function List({children, className}: PropsWithChildren<{className?: string}>) {
	return (
		<ul className={cn("my-6 ml-6 list-none text-sea-ink [&>li]:mt-2", className)}>{children}</ul>
	)
}

export function Strong({children, className}: PropsWithChildren<{className?: string}>) {
	return <strong className={cn("font-semibold text-sea-ink", className)}>{children}</strong>
}

export function Small({children, className}: PropsWithChildren<{className?: string}>) {
	return (
		<small className={cn("font-medium text-sea-ink text-sm leading-none", className)}>
			{children}
		</small>
	)
}
