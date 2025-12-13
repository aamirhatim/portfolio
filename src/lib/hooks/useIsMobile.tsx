import { useCallback, useEffect, useState } from "react";

const MOBILE_BREAKPOINT_PX = 768;
const DEBOUNCE_DELAY_MS = 200;

// Define debounce function
const debounce = (f: Function, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => f(...args), delay);
    };
};

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false);   // Assume default view is desktop

    // Define helper to check screen size
    const checkScreenSize = useCallback(() => {
        setIsMobile(window.innerWidth < MOBILE_BREAKPOINT_PX);
    }, []);

    useEffect(() => {
        if (typeof window === 'undefined') return;                              // Check if window exists
        const debouncedCheck = debounce(checkScreenSize, DEBOUNCE_DELAY_MS);    // Apply debounce
        window.addEventListener('resize', debouncedCheck);                      // Add listener
        checkScreenSize();                                                      // Check screen size
        return () => window.removeEventListener('resize', debouncedCheck);      // Cleanup
    }, [checkScreenSize]);

    return isMobile;
};

export default useIsMobile;