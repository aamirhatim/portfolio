import { createRootRoute, Outlet } from '@tanstack/react-router'
import Navbar from '../components/molecules/navbar'
import Sidebar from '../components/molecules/sidebar'
import { useEffect, useState } from 'react'

export const Route = createRootRoute({
    component: () => {
        // Get session storage
        const navSS = sessionStorage.getItem('navSelection')
        const currentNav = navSS ? navSS : ''

        const [nav, setNav] = useState<string>(currentNav)
        const [sidebarViz, setSidebarViz] = useState<boolean>(false)

        useEffect( () => {
            setNav(nav)

            if ( nav != '' ) {
                setSidebarViz(true)
            }
        }, [nav])

        return (
        <div className='h-dvh w-dvw box-border flex flex-col'>
            <nav className='fixed top-0 left-0'><Navbar setNav={setNav} setSidebarViz={setSidebarViz}/></nav>
            <div className='flex gap-20 h-full bg-amber-400'>
                {sidebarViz && <Sidebar title={nav} setViz={setSidebarViz} /> }
                <div className='box-border pr-[12%] py-40 grow overflow-y-scroll'>
                    <Outlet />
                </div>
            </div>
        </div>
    )}
})