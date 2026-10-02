import { useEffect, useRef, ReactNode } from "react";

interface ScrollParallaxProps {
    children: ReactNode;
    /**
     * Speed multiplier for upward float as the user scrolls down.
     * E.g. 0.15 floats upward ~15px for every 100px scrolled.
     * Default: 0.15
     */
    speed?: number;
    className?: string;
    innerClassName?: string;
    disabled?: boolean;
}

/**
 * ScrollParallax Atom
 * Applies high-performance vertical translation using requestAnimationFrame.
 * Updates DOM style directly without triggering React re-renders.
 * Completely respects prefers-reduced-motion.
 */
export default function ScrollParallax({
    children,
    speed = 0.15,
    className = "",
    innerClassName = "",
    disabled = false
}: ScrollParallaxProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (disabled || speed === 0) return;

        // Check reduced motion preference
        const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (prefersReduced) return;

        let frameId: number | null = null;
        let isVisible = false;
        let cachedDocTop = 0;
        let cachedWindowHeight = window.innerHeight;

        const measureGeometry = () => {
            if (!containerRef.current) return;
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const rect = containerRef.current.getBoundingClientRect();
            cachedDocTop = rect.top + scrollY;
            cachedWindowHeight = window.innerHeight;
        };

        const updatePosition = () => {
            frameId = null;
            if (!innerRef.current || !isVisible) return;

            const scrollY = window.scrollY || window.pageYOffset || 0;
            const scrollProgress = cachedDocTop < cachedWindowHeight
                ? scrollY
                : Math.max(0, scrollY - (cachedDocTop - cachedWindowHeight));

            const offset = scrollProgress * speed;
            innerRef.current.style.transform = `translate3d(0, ${-offset}px, 0)`;
        };

        const handleScroll = () => {
            if (!isVisible || frameId !== null) return;
            frameId = requestAnimationFrame(updatePosition);
        };

        const handleResize = () => {
            measureGeometry();
            if (isVisible) {
                updatePosition();
            }
        };

        measureGeometry();

        // IntersectionObserver ensures we only track scroll position when near or in viewport
        const observer = new IntersectionObserver(
            (entries) => {
                const entry = entries[0];
                isVisible = entry?.isIntersecting ?? false;
                if (isVisible) {
                    measureGeometry();
                    updatePosition();
                }
            },
            { rootMargin: "200px 0px 200px 0px" }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        window.addEventListener("scroll", handleScroll, { passive: true });
        window.addEventListener("resize", handleResize, { passive: true });

        return () => {
            observer.disconnect();
            window.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", handleResize);
            if (frameId !== null) {
                cancelAnimationFrame(frameId);
            }
        };
    }, [speed, disabled]);

    return (
        <div ref={containerRef} className={className}>
            <div ref={innerRef} className={`will-change-transform ${innerClassName}`}>
                {children}
            </div>
        </div>
    );
}
