import {createFileRoute} from "@tanstack/react-router"
import {formSchema} from "#/features/calculator/schema"

// TODO, validate search params and redirect to /calculator if invalid
export const Route = createFileRoute("/preview_macros/")({
	component: RouteComponent,
	validateSearch: search => {
		// TODO use zod schemas to validate search params
		console.log("search", search)
		return formSchema.parse(search)
	},
})

function RouteComponent() {
	return <div>Hello "/preview_macros/"!</div>
}
