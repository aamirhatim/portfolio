import { createFileRoute } from '@tanstack/react-router'
import SkillsPage from '../components/pages/skillsPage'

export const Route = createFileRoute('/skills')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SkillsPage />
}
