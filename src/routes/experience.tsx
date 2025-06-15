import { createFileRoute } from '@tanstack/react-router'
import ExperiencePage from '../components/pages/experiencePage'

export const Route = createFileRoute('/experience')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ExperiencePage />
}
