import { useEffect, useState } from "react"
import { Outlet } from "react-router"
import Sidebar from "../molecules/Sidebar"
import Navbar from "../molecules/Navbar"
import { AppContext, AppContextInterface } from "../../context/appContext"
import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig, FirebaseAppContext } from "../../context/firebaseAppContext"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectStorageEmulator, getStorage } from "firebase/storage"

export default function AppLayout() {
    // Init state
    const [nav, setNav] = useState<string>(sessionStorage.getItem("navSelect") || "home")

    // Init context
    const initContext:AppContextInterface = {
        navSelect: nav,
        setNavSelect: setNav
    }

    // Init Firebase app
    const isLocal:boolean = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    const firebaseApp:FirebaseApp = initializeApp(firebaseConfig);
    if (isLocal) {
        console.warn("Running locally. Connecting to emulators");
        connectFirestoreEmulator(getFirestore(firebaseApp), "127.0.0.1", 5001);
        connectStorageEmulator(getStorage(firebaseApp), "127.0.0.1", 5002);
    }

    // Update sessionStorage whenever navSelect changes
    useEffect( () => {
        sessionStorage.setItem("navSelect", initContext.navSelect)
    }, [initContext.navSelect])

    return (
        <FirebaseAppContext.Provider value={firebaseApp}>
            <AppContext.Provider value={initContext}>
                <Navbar />
                <div id="main" className="h-full w-full inline">
                    <Sidebar title={initContext.navSelect} />
                    <div id="content" className="box-border pt-40 pb-20 pr-20 h-full overflow-y-scroll">
                        <Outlet />
                    </div>
                </div>
            </AppContext.Provider>
        </FirebaseAppContext.Provider>
    )
}