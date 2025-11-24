import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import useIsMobile from "../hooks";
import Navbar from "../molecules/Navbar";
import Sidebar from "../molecules/Sidebar";
import { useLocation, useOutlet } from "react-router";
import { motion, AnimatePresence, Transition } from "framer-motion";
import { ANIMATION_DURATION_MS } from "../../data/constants";

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

export default function AppLayout() {
    // Get context
    const location = useLocation();
    const currentOutlet = useOutlet();
    const { navSelect, setNavSelect } = useAppContext();

    // Init state
    const isMobile = useIsMobile();
    const showSidebar = !isMobile;

    // Handle broswer navigation (back/forward)
    useEffect(() => {
        if (location.pathname === "/") {
            setNavSelect("home");
        } else {
            const newNav = location.pathname.substring(1);
            setNavSelect(newNav);
        }
    }, [location.pathname]);
    
    return (
        <>
            <Navbar />
            <div className="h-screen w-screen w-max-view mx-auto flex">
                {showSidebar && <Sidebar title={navSelect} />}

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
    )
}