import { useEffect, useMemo, useState } from "react"
import { AppContext, AppContextInterface } from "../../context/appContext"
import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig, FirebaseAppContext } from "../../context/firebaseAppContext"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { Outlet, useLocation } from "react-router";
import useIsMobile from "../hooks";
import Navbar from "../molecules/Navbar";

export default function Main() {
    // Get context
    const location = useLocation();
    
    // Init state
    const isMobile = useIsMobile();
    const [nav, setNav] = useState<string>(sessionStorage.getItem("navSelect") || "home");
    const [imgUrls, setImgUrls] = useState<Map<string, string>>(new Map());

    // Init context
    const initContext:AppContextInterface = {
        navSelect: nav,
        setNavSelect: setNav,
        imgUrlCache: imgUrls,
        setImgUrlCache: setImgUrls,
    }

    // Init Firebase app
    const firebaseApp:FirebaseApp = useMemo(() => {
        const isLocal:boolean = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const app = initializeApp(firebaseConfig);

        if (isLocal) {
            console.warn("Running locally. Connecting to emulators");
            connectFirestoreEmulator(getFirestore(app), "127.0.0.1", 5001);
            connectStorageEmulator(getStorage(app), "127.0.0.1", 5002);
        };

        return app;
    }, []);

    // Handle broswer navigation (back/forward)
    useEffect(() => {
        if (location.pathname === "/") {
            setNav("home");
        } else {
            const newNav = location.pathname.substring(1);
            setNav(newNav);
        }

        // Update document title
        let pageTitle = "Aamir Husain";
        if (location.pathname !== "/" && !location.pathname.startsWith("/projects/")) {
            const subTitle = location.pathname.substring(1).charAt(0).toUpperCase() + location.pathname.substring(2);
            pageTitle = `Aamir Husain | ${subTitle}`;
        }
        document.title = pageTitle;

        // Scroll to top of page
        if (typeof window !== 'undefined') {
        window.scrollTo({
            top: 0,
            behavior: 'auto'
        });
    }
    }, [location.pathname]);

    return (
        <FirebaseAppContext.Provider value={firebaseApp}>
            <AppContext.Provider value={initContext}>
                <Navbar />
                <div className={`w-full mx-auto pb-10 ${isMobile ? 'pt-25' : 'pt-40'}`}>
                    <Outlet />
                </div>
            </AppContext.Provider>
        </FirebaseAppContext.Provider>
    )
}