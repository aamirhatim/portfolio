import { Rocket, Code2, Bot, Boxes } from "lucide-react";
import WhatIDoItem, { WhatIDoItemData } from "../molecules/WhatIDoItem";
import ScrollParallax from "../atoms/ScrollParallax";

interface WhatIDoSectionProps {
    isMobile: boolean;
}

const STAGGERED_WIDTHS = [
    "w-[96vw]",
    "w-[86vw]",
    "w-[76vw]",
    "w-[66vw]",
];

const EXPERTISE_ITEMS: WhatIDoItemData[] = [
    {
        id: "prototyping",
        title: "0 -> 1 rapid prototyping",
        description: "Taking concepts from zero to functional hardware and software MVPs.",
        icon: Rocket,
    },
    {
        id: "frontend",
        title: "Frontend development",
        description: "Building performant, responsive web apps with modern React & TypeScript.",
        icon: Code2,
    },
    {
        id: "robotics",
        title: "Robotics engineering",
        description: "Autonomous navigation, sensor integration, and real-time control.",
        icon: Bot,
    },
    {
        id: "cad",
        title: "CAD & 3D printing",
        description: "Parametric mechanical design & rapid additive manufacturing.",
        icon: Boxes,
    },
];

const DESKTOP_STAGGER_CLASSES = [
    "md:mt-0",
    "md:mt-15 lg:mt-20",
    "md:mt-30 lg:mt-40",
    "md:mt-45 lg:mt-60",
];

const DESKTOP_PARALLAX_SPEEDS = [0.04, 0.07, 0.10, 0.13];

/**
 * WhatIDoSection Organism
 * - Mobile: Stacks items in a staggered column of boxes anchored to the left viewport edge.
 * - Desktop: Multi-column grid across the page matching the About page skills section with stairs stagger and scroll parallax.
 */
export default function WhatIDoSection({ isMobile }: WhatIDoSectionProps) {
    return (
        <section
            className={`flex flex-col w-full my-6 md:my-10 ${isMobile ? "" : "px-10"}`}
            aria-label="What I do"
        >
            <h2
                className={`title text-3xl mb-6 text-(--txt-title-color) ${isMobile ? "px-4" : ""
                    }`}
            >
                What I do
            </h2>

            {/* Mobile layout: Staggered boxes touching left viewport edge */}
            <div className="flex md:hidden flex-col gap-3 items-start w-full">
                {EXPERTISE_ITEMS.map((item, idx) => (
                    <WhatIDoItem
                        key={item.id}
                        item={item}
                        isMobile={true}
                        layout="mobile"
                        width={item.width || STAGGERED_WIDTHS[idx % STAGGERED_WIDTHS.length]}
                    />
                ))}
            </div>

            {/* Desktop layout: Multi-column grid matching About page skills section with stairs stagger and scroll parallax */}
            <div className="hidden mt-10 md:grid md:grid-cols-4 gap-6 lg:gap-8 w-full items-start">
                {EXPERTISE_ITEMS.map((item, idx) => (
                    <ScrollParallax
                        key={item.id}
                        speed={item.speed || DESKTOP_PARALLAX_SPEEDS[idx % DESKTOP_PARALLAX_SPEEDS.length]}
                        className={`w-full ${DESKTOP_STAGGER_CLASSES[idx % DESKTOP_STAGGER_CLASSES.length]}`}
                        innerClassName="w-full"
                    >
                        <WhatIDoItem
                            item={item}
                            isMobile={false}
                            layout="desktop"
                        />
                    </ScrollParallax>
                ))}
            </div>
        </section>
    );
}
