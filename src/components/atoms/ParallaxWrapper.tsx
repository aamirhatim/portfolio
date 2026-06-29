import { useRef, useCallback, useEffect, ReactNode } from 'react';
import useIsMobile from '../../lib/hooks/useIsMobile';

export default function ParallaxWrapper(props: { children: ReactNode; multiplier?: number; className?: string }) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const frameIdRef = useRef<number | null>(null);
    const isMobile = useIsMobile();

    const multiplier = props.multiplier || 10;

    useEffect(() => {
        return () => {
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
        };
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (wrapperRef.current) {
            rectRef.current = wrapperRef.current.getBoundingClientRect();
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!wrapperRef.current) return;
        if (!rectRef.current) {
            rectRef.current = wrapperRef.current.getBoundingClientRect();
        }

        const rect = rectRef.current;
        if (rect.width === 0 || rect.height === 0) return;

        // Calculate X and Y coordinates relative to the center of the element
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        if (frameIdRef.current) {
            cancelAnimationFrame(frameIdRef.current);
        }

        frameIdRef.current = requestAnimationFrame(() => {
            if (wrapperRef.current) {
                wrapperRef.current.style.setProperty('--parallax-x', `${x}`);
                wrapperRef.current.style.setProperty('--parallax-y', `${y}`);
            }
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        rectRef.current = null;
        if (frameIdRef.current) {
            cancelAnimationFrame(frameIdRef.current);
        }
        if (!wrapperRef.current) return;
        wrapperRef.current.style.setProperty('--parallax-x', `0`);
        wrapperRef.current.style.setProperty('--parallax-y', `0`);
    }, []);

    if (isMobile) {
        return <>{props.children}</>;
    }

    return (
        <div
            ref={wrapperRef}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ '--parallax-x': 0, '--parallax-y': 0 } as React.CSSProperties}
            className={`w-fit h-fit ${props.className || ''}`}
        >
            <div
                className='transition-transform duration-200 ease-out h-full w-full'
                style={{ transform: `translate(calc(var(--parallax-x) * ${multiplier}px), calc(var(--parallax-y) * ${multiplier}px))` }}
            >
                {props.children}
            </div>
        </div>
    );
}
