import {createFileRoute} from "@tanstack/react-router"

// TODO, validate search params and redirect to /calculator if invalid
export const Route = createFileRoute("/preview_macros/")({
	component: RouteComponent,
	validateSearch: search => {
		console.log("search", search)
		return true
	},
})

function RouteComponent() {
	return <div>Hello "/preview_macros/"!</div>
}
