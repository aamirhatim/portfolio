import { useRef } from 'react';
import useIntersectionObserver from '../../lib/hooks/useIntersectionObserver';

export default function AnimateInView({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(ref, { threshold: 0.25 }, true);

    return (
        <div
            ref={ref}
            className={`transition-all duration-300 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
        >
            {children}
        </div>
    )
}