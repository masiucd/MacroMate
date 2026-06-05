import {createFileRoute} from "@tanstack/react-router"
import {Heading} from "#/components/typography"
import {PageWrapper} from "#/components/wrappers/page_wrapper"

export const Route = createFileRoute("/how_it_works/")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<PageWrapper>
			<Heading as="h1">How it works</Heading>
		</PageWrapper>
	)
}
