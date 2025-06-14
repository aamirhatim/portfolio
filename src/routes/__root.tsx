import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/molecules/Navbar/navbar'
import HomeButton from '../components/atoms/HomeButton/homeButton'

export const Route = createRootRoute({
    component: () => (
        <>
            <HomeButton />
            <div id="route-outlet">
                <Outlet />
            </div>
            <Navbar />
        </>
    )
})