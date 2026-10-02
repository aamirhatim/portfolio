import { HTMLAttributes } from "react";
import LazyImg from "../atoms/LazyImg";
import ScrollParallax from "../atoms/ScrollParallax";

interface HeroPhotoProps extends HTMLAttributes<HTMLDivElement> {
    isMobile: boolean;
}

/**
 * HeroPhoto Molecule
 * Displays a square-cropped portrait of the user positioned behind the hero text at bottom-right.
 * Features subtle scroll-up parallax translation, hover scale effect, and mobile edge spill.
 */
export default function HeroPhoto({ isMobile, className = "", ...restProps }: HeroPhotoProps) {
    const positionClasses = isMobile
        ? "absolute -right-8 bottom-[-10px] w-56 h-56 sm:w-64 sm:h-64 z-0 pointer-events-auto"
        : "absolute right-4 lg:right-16 bottom-0 w-56 h-56 md:w-60 md:h-60 lg:w-80 lg:h-80 z-0 pointer-events-auto";

    return (
        <div className={`${positionClasses} ${className}`}>
            <ScrollParallax speed={0.2} className="w-full h-full">
                <div
                    className="relative group w-full h-full aspect-square rounded-2xl md:rounded-3xl overflow-hidden border border-(--border-color) shadow-xl hover:shadow-2xl transition-transform duration-300 ease-out cursor-pointer hover:scale-105 bg-(--bg-card)"
                    title="Aamir Husain"
                    {...restProps}
                >
                    <LazyImg
                        imgPath="/aboutme.jpg"
                        placeholderPath="/thumbs/aboutme.jpg"
                        alt="Aamir Husain"
                        className="w-full h-full"
                    />

                    {/* Subtle aesthetic gradient overlay to soften edges and guarantee text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-(--bg-color)/30 via-transparent to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-10" />
                </div>
            </ScrollParallax>
        </div>
    );
}
