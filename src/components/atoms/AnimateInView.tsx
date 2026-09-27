import { useRef } from 'react';
import useIntersectionObserver from '../../lib/hooks/useIntersectionObserver';

export default function AnimateInView({
    children,
    className = '',
    immediate = false
}: {
    children: React.ReactNode;
    className?: string;
    immediate?: boolean;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const isVisible = useIntersectionObserver(ref, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }, true);
    const shouldShow = immediate || isVisible;

    return (
        <div
            ref={ref}
            className={`transition-[opacity,transform] duration-400 ease-out will-change-transform ${shouldShow ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
        >
            {children}
        </div>
    );
}