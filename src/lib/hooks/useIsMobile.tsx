import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT_PX = 768;

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState<boolean>(
        typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT_PX : false
    );

    useEffect(() => {
        const checkScreenSize = () => {
            setIsMobile(window.innerWidth < MOBILE_BREAKPOINT_PX);
        };

        window.addEventListener('resize', checkScreenSize);
        checkScreenSize();
        return () => window.removeEventListener('resize', checkScreenSize);
    }, []);

    return isMobile;
};

export default useIsMobile;