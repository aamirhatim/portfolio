import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/molecules/navbar'

export const Route = createRootRoute({
    component: () => (
        <div id='app-container' className='min-h-dvh w-dvw box-border flex flex-col bg-red-950'>
            <Navbar />
            <div id='route-outlet' className='box-border h-full pt-40 pb-15 px-12'>
                <Outlet />
            </div>
        </div>
    )
})