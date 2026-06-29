import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT_PX = 768;
const DEBOUNCE_DELAY_MS = 200;

// Define debounce function
const debounce = (f: (...args: unknown[]) => unknown, delay: number) => {
    let timeout: ReturnType<typeof setTimeout>;
    return (...args: unknown[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => f(...args), delay);
    };
};

let isMobileSnapshot = typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT_PX : false;
const listeners = new Set<() => void>();

let isListening = false;

const emitChange = () => {
    const newValue = typeof window !== 'undefined' ? window.innerWidth < MOBILE_BREAKPOINT_PX : false;
    if (isMobileSnapshot !== newValue) {
        isMobileSnapshot = newValue;
        listeners.forEach(listener => listener());
    }
};

const debouncedEmitChange = debounce(emitChange, DEBOUNCE_DELAY_MS);

const subscribe = (listener: () => void) => {
    listeners.add(listener);
    if (!isListening && typeof window !== 'undefined') {
        window.addEventListener('resize', debouncedEmitChange);
        isListening = true;
    }
    return () => {
        listeners.delete(listener);
        if (listeners.size === 0 && isListening && typeof window !== 'undefined') {
            window.removeEventListener('resize', debouncedEmitChange);
            isListening = false;
        }
    };
};

const getSnapshot = () => isMobileSnapshot;

const getServerSnapshot = () => false;

const useIsMobile = () => {
    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
};

export default useIsMobile;