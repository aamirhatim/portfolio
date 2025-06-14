import { createRootRoute, Link, Outlet } from '@tanstack/react-router'

export const Route = createRootRoute({
    component: () => (
        <>
            <div id="route-outlet">
                <Outlet />
            </div>
        </>
    )
})