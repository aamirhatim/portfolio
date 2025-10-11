import { useEffect, useState } from "react"
import { Outlet } from "react-router"
import Sidebar from "../molecules/Sidebar"
import Navbar from "../molecules/Navbar"
import { AppContext, AppContextInterface } from "../../context/appContext"
import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig, FirebaseContext } from "../../context/firebaseContext"

export default function AppLayout() {
    // Init state
    const [nav, setNav] = useState<string>(sessionStorage.getItem("navSelect") || "home")

    // Init context
    const initContext:AppContextInterface = {
        navSelect: nav,
        setNavSelect: setNav
    }

    // Init Firebase app
    const firebaseApp:FirebaseApp = initializeApp(firebaseConfig);

    // Update sessionStorage whenever navSelect changes
    useEffect( () => {
        sessionStorage.setItem("navSelect", initContext.navSelect)
    }, [initContext.navSelect])

    return (
        <FirebaseContext.Provider value={firebaseApp}>
            <AppContext.Provider value={initContext}>
                <Navbar />
                <div id="main" className="h-full w-full inline">
                    <Sidebar title={initContext.navSelect} />
                    <div id="content" className="box-border pt-40 pb-20 pr-20 h-full overflow-y-scroll">
                        <Outlet />
                    </div>
                </div>
            </AppContext.Provider>
        </FirebaseContext.Provider>
    )
}