import { createFileRoute } from "@tanstack/react-router"
import IndexPage from "../components/pages/indexPage"

export const Route = createFileRoute('/')({
    component: Index
})

function Index() {
    return (
        <IndexPage />
    )
}