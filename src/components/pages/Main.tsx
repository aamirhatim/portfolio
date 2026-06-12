import { useEffect, useMemo, useState } from "react"
import { AppContext, AppContextInterface } from "../../context/appContext"
import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig, FirebaseAppContext } from "../../context/firebaseAppContext"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { connectAuthEmulator, getAuth } from "firebase/auth"
import { Outlet, useLocation } from "react-router";
import useIsMobile from "../../lib/hooks/useIsMobile";
import Navbar from "../molecules/Navbar";

export default function Main() {
    // Get context
    const location = useLocation();

    // Init state
    const isMobile = useIsMobile();
    const [nav, setNav] = useState<string>(sessionStorage.getItem("navSelect") || "home");

    const [prevPathname, setPrevPathname] = useState(location.pathname);

    // Sync navigation state during render on pathname changes to prevent post-mount cascading renders
    if (location.pathname !== prevPathname) {
        setPrevPathname(location.pathname);
        const nextNav = location.pathname === "/" ? "home" : location.pathname.substring(1);
        setNav(nextNav);
    }

    // Init context
    const initContext = useMemo((): AppContextInterface => ({
        navSelect: nav,
        setNavSelect: setNav,
    }), [nav]);

    // Init Firebase app
    const firebaseApp: FirebaseApp = useMemo(() => {
        const isLocal: boolean = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const app = initializeApp(firebaseConfig);

        if (isLocal) {
            console.warn("Running locally. Connecting to emulators");
            connectFirestoreEmulator(getFirestore(app), "127.0.0.1", 5001);
            connectStorageEmulator(getStorage(app), "127.0.0.1", 5002);
            connectAuthEmulator(getAuth(app), "http://127.0.0.1:5004", { disableWarnings: true });
        };

        return app;
    }, []);

    // Handle broswer navigation (back/forward)
    useEffect(() => {
        // Update document title
        let pageTitle = "Aamir Husain";
        if (location.pathname !== "/" && !location.pathname.startsWith("/projects/")) {
            const subTitle = location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);
            pageTitle = `Aamir Husain | ${subTitle}`;
        }
        document.title = pageTitle;

        // Scroll to top of page
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }, [location.pathname]);

    return (
        <FirebaseAppContext.Provider value={firebaseApp}>
            <AppContext.Provider value={initContext}>
                <Navbar />
                <div className={`w-full mx-auto pb-40 ${isMobile ? 'pt-25' : 'pt-40'}`}>
                    <Outlet />
                </div>
            </AppContext.Provider>
        </FirebaseAppContext.Provider>
    )
}