import { useEffect, useState, RefObject } from 'react';

/**
 * Hook to track whether an element is visible in the viewport using IntersectionObserver.
 */
export default function useIntersectionObserver(
    ref: RefObject<Element | null>,
    options: IntersectionObserverInit = { threshold: 0, root: null, rootMargin: '0px' },
    triggerOnce: boolean = false
) {
    const [isIntersecting, setIsIntersecting] = useState(false);

    useEffect(() => {
        const element = ref.current;
        if (!element) return;

        const observer = new IntersectionObserver(([entry]) => {
            setIsIntersecting(entry.isIntersecting);
            if (entry.isIntersecting && triggerOnce) {
                observer.unobserve(element);
            }
        }, options);

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [ref, options.threshold, options.root, options.rootMargin, triggerOnce]);

    return isIntersecting;
}
