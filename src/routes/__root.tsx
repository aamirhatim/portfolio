import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/molecules/Navbar/navbar'

export const Route = createRootRoute({
    component: () => (
        <>
            <div id="route-outlet">
                <Outlet />
            </div>
            <Navbar />
        </>
    )
})