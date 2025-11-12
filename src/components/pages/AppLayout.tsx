import { useEffect, useState } from "react";
import { useAppContext } from "../../context/appContext";
import useIsMobile from "../hooks";
import Navbar from "../molecules/Navbar";
import Sidebar from "../molecules/Sidebar";
import { Outlet, useNavigate } from "react-router";

export const ANIMATION_DURATION_MS = 300;

export default function AppLayout() {
    // Get context
    const navigate = useNavigate()
    const { navSelect } = useAppContext();

    // Init state
    const isMobile = useIsMobile();
    const showSidebar = !isMobile;
    const [isAnimating, setIsAnimating] = useState<boolean>(true);

    const animationClasses = `transition-opacity duration-[${ANIMATION_DURATION_MS}ms] ease-in-out ${isAnimating ? 'opacity-0' : 'opacity-100'}`;

    // Navigation behavior
    useEffect(() => {
        setIsAnimating(true);
        const timer = setTimeout(() => {
            const targetPath = navSelect === "home" ? "/" : `/${navSelect}`;
            sessionStorage.setItem("navSelect", navSelect);
            navigate(targetPath);
            setIsAnimating(false);
        }, ANIMATION_DURATION_MS);
        return () => clearTimeout(timer);
    }, [navSelect]);
    
    return (
        <>
        <Navbar />
        <div className="h-full w-full w-max-view mx-auto">
            <div className="h-full w-full flex">
                {showSidebar && <Sidebar title={navSelect} />}
                <div className={`box-border pb-20 h-full overflow-y-scroll grow-1 ${animationClasses} ${isMobile ? 'pt-25' : 'pt-40'}`}>
                    <Outlet />
                </div>
            </div>
        </div>
        </>
    )
}