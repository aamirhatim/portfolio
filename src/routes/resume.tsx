import { createFileRoute } from '@tanstack/react-router'
import ResumePage from '../components/pages/resumePage'

export const Route = createFileRoute('/resume')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ResumePage />
}
