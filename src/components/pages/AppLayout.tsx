import { useEffect, useState } from "react"
import { Outlet, useNavigate } from "react-router"
import Sidebar from "../molecules/Sidebar"
import Navbar from "../molecules/Navbar"
import { AppContext, AppContextInterface } from "../../context/appContext"
import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig, FirebaseAppContext } from "../../context/firebaseAppContext"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import useIsMobile from "../hooks"

export const ANIMATION_DURATION_MS = 300;

export default function AppLayout() {
    // Init state
    const isMobile = useIsMobile();
    const showSidebar = !isMobile;
    const navigate = useNavigate()
    const [nav, setNav] = useState<string>(sessionStorage.getItem("navSelect") || "home");
    const [isAnimating, setIsAnimating] = useState<boolean>(true);

    const animationClasses = `transition-opacity duration-[${ANIMATION_DURATION_MS}ms] ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`;

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

    // Navigation behavior
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            const targetPath = nav === "home" ? "/" : `/${nav}`;
            navigate(targetPath);
            setIsAnimating(false);
        }, ANIMATION_DURATION_MS);
        return () => clearTimeout(timer);
    }, [nav]);

    return (
        <FirebaseAppContext.Provider value={firebaseApp}>
            <AppContext.Provider value={initContext}>
                <Navbar />
                <div className="box-border px-6 h-full w-full w-max-view mx-auto">
                    <div className="h-full w-full flex">
                        {showSidebar && <Sidebar title={initContext.navSelect} />}
                        <div className={`box-border pt-40 pb-20 pr-10 h-full overflow-y-scroll grow-1 ${animationClasses}`}>
                            <Outlet />
                        </div>
                    </div>
                </div>
            </AppContext.Provider>
        </FirebaseAppContext.Provider>
    )
}