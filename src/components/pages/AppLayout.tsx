import { useEffect } from "react";
import { useAppContext } from "../../context/appContext";
import useIsMobile from "../hooks";
import Navbar from "../molecules/Navbar";
import Sidebar from "../molecules/Sidebar";
import { useLocation, useNavigate, useOutlet } from "react-router";
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
    const navigate = useNavigate();
    const currentOutlet = useOutlet();
    const { navSelect, setNavSelect } = useAppContext();

    // Init state
    const isMobile = useIsMobile();
    const showSidebar = !isMobile;

    // Navigation behavior
    useEffect(() => {
        const targetPath = navSelect === "home" ? "/" : `/${navSelect}`;
        if (location.pathname !== targetPath) {
            sessionStorage.setItem("navSelect", navSelect);
            navigate(targetPath);
        }
    }, [navSelect, navigate, location.pathname]);

    // Handle user forward/back actions
    useEffect(() => {
        const handlePopState = () => {
            const currentPath = location.pathname;
            let newNav = currentPath === "/" ? "home" : currentPath.substring(1);
            if (newNav !== navSelect) {
                setNavSelect(newNav);
            };
        };

        window.addEventListener("popstate", handlePopState);
        return () => window.removeEventListener("popstate", handlePopState);
    }, [navSelect, setNavSelect]);
    
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