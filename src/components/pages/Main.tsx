import { useEffect, useMemo, useState } from "react"
import { AppContext, AppContextInterface } from "../../context/appContext"
import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig, FirebaseAppContext } from "../../context/firebaseAppContext"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import { ANIMATION_DURATION_MS } from "../../data/constants";
import { useLocation, useOutlet } from "react-router";
import useIsMobile from "../hooks";
import { motion, AnimatePresence, Transition } from "framer-motion";
import Navbar from "../molecules/Navbar";
import Sidebar from "../molecules/Sidebar";

const pageVariants = {
    initial: { opacity: 0, y: 10 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -10 },
};

const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: ANIMATION_DURATION_MS / 1000,
};

export default function Main() {
    // Get context
    const location = useLocation();
    const currentOutlet = useOutlet();
    
    // Init state
    const isMobile = useIsMobile();
    const showSidebar = !isMobile;
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
    }, [location.pathname]);

    return (
        <FirebaseAppContext.Provider value={firebaseApp}>
            <AppContext.Provider value={initContext}>
                <>
                    <Navbar />
                    <div className="h-screen w-screen w-max-view mx-auto flex">
                        {showSidebar && <Sidebar title={nav} />}

                        <div className={`flex-1 h-full overflow-y-auto relative ${isMobile ? 'pt-25' : 'pt-40'}`}>
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    initial="initial"
                                    animate="in"
                                    exit="out"
                                    variants={pageVariants}
                                    transition={pageTransition as Transition}
                                    className="h-full"
                                >
                                    {currentOutlet}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </>
            </AppContext.Provider>
        </FirebaseAppContext.Provider>
    )
}