import { useEffect, useState } from 'react';

/**
 * Hook to delay unmounting of a component to allow for exit animations.
 * @param isMounted - boolean indicating whether the component should be mounted
 * @param unmountDelay - delay in milliseconds before unmounting
 * @returns boolean indicating whether the component is still transitioning out
 */
export default function useMountTransition(isMounted: boolean, unmountDelay: number) {
    const [hasTransitionedIn, setHasTransitionedIn] = useState(false);

    useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (isMounted && !hasTransitionedIn) {
            setHasTransitionedIn(true);
        } else if (!isMounted && hasTransitionedIn) {
            timeoutId = setTimeout(() => setHasTransitionedIn(false), unmountDelay);
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [unmountDelay, isMounted, hasTransitionedIn]);

    return hasTransitionedIn;
}
