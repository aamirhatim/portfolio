import { createFileRoute } from '@tanstack/react-router'
import MePage from '../components/pages/mePage'

export const Route = createFileRoute('/me')({
  component: RouteComponent,
})

function RouteComponent() {
  return <MePage />
}
