import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/molecules/navbar'

export const Route = createRootRoute({
    component: () => (
        <div className='min-h-dvh w-dvw box-border flex flex-col'>
            <Navbar />
            <div className='box-border h-full pt-40 pb-15 px-[15%]'>
                <Outlet />
            </div>
        </div>
    )
})