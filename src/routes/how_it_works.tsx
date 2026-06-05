import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/how_it_works')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/how_it_works"!</div>
}
