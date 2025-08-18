import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import Navbar from '../components/molecules/navbar'
import Sidebar from '../components/molecules/sidebar'
import { RouterContext } from '../context/routerContext'

export const Route = createRootRouteWithContext<RouterContext>()({
    component: () => {
        // Get route context
        const routeContext = Route.useRouteContext()

        return (
            <div className='h-dvh w-dvw box-border flex flex-col bg-violet-950 text-violet-100'>
                <nav className='fixed top-0 left-0'><Navbar /></nav>
                <div className='flex gap-20 h-full'>
                    {routeContext.nav != '' && <Sidebar title={routeContext.nav} /> }
                    <div className='box-border pr-[12%] py-40 grow overflow-y-scroll'>
                        <Outlet />
                    </div>
                </div>
            </div>
        )
    }
})