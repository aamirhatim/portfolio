import { createFileRoute } from '@tanstack/react-router'
import ProjectsPage from '../components/pages/projectsPage'

export const Route = createFileRoute('/projects')({
    component: RouteComponent,
})

function RouteComponent() {
    return <ProjectsPage />
}
