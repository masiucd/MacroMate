import {TanStackDevtools} from "@tanstack/react-devtools"
import type {QueryClient} from "@tanstack/react-query"
import {createRootRouteWithContext, HeadContent, Scripts} from "@tanstack/react-router"
import {TanStackRouterDevtoolsPanel} from "@tanstack/react-router-devtools"
import {Heading} from "#/components/typography"
import {appConfig} from "#/config/app"
import TanStackQueryDevtools from "../integrations/tanstack-query/devtools"
import appCss from "../styles.css?url"

interface MyRouterContext {
	queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: appConfig.name,
				"aria-description": appConfig.described,
				"aria-label": "Macro Calculator",
				"aria-hidden": "false",
				"data-testid": "app-title",
				"data-analytics": "app-title",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
		],
	}),
	shellComponent: RootDocument,
})

function RootDocument({children}: {children: React.ReactNode}) {
	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<Header />
				<main>{children}</main>
				<Footer />
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Router Devtools",
							render: <TanStackRouterDevtoolsPanel />,
						},
						TanStackQueryDevtools,
					]}
				/>
				<Scripts />
			</body>
		</html>
	)
}

function Header() {
	return (
		<header>
			<div className="mx-auto max-w-7xl">
				<Heading as="h4" className="site-title" data-testid="site-title">
					{appConfig.name}
				</Heading>
				<nav>
					<ul>
						<li></li>
					</ul>
				</nav>
			</div>
		</header>
	)
}

function Footer() {
	return (
		<footer>
			<div className="mx-auto max-w-7xl">
				<small>
					Built by{" "}
					<a
						href={appConfig.meta.socialMedia.website.url}
						target="_blank"
						rel="noopener noreferrer"
					>
						{appConfig.meta.socialMedia.twitter.handle}
					</a>{" "}
					· Source on{" "}
					<a href={appConfig.meta.socialMedia.github.url} target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
				</small>
			</div>
		</footer>
	)
}
