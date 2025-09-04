import { useEffect, useState } from 'react'
import { Outlet } from 'react-router'
import Sidebar from '../molecules/Sidebar'
import Navbar from '../molecules/Navbar'
import { AppContext, AppContextInterface } from '../../context/appContext'

export default function AppLayout() {
    // Init state
    const [nav, setNav] = useState<string>(sessionStorage.getItem("navSelect") || "home")

    // Init context
    const initContext:AppContextInterface = {
        navSelect: nav,
        setNavSelect: setNav
    }

    // Update sessionStorage whenever navSelect changes
    useEffect( () => {
        sessionStorage.setItem("navSelect", initContext.navSelect)
    }, [initContext.navSelect])

    return (
        <AppContext.Provider value={initContext}>
            <Navbar />
            <Sidebar title={initContext.navSelect} />
            <Outlet />
        </AppContext.Provider>
    )
}