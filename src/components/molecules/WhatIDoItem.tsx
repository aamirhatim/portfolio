import { ElementType } from "react";

export interface WhatIDoItemData {
    id: string;
    title: string;
    icon: ElementType;
    description?: string;
    text?: string;
    width?: string;
    speed?: number;
}

interface WhatIDoItemProps {
    item: WhatIDoItemData;
    isMobile?: boolean;
    width?: string;
    className?: string;
    layout?: "mobile" | "desktop" | "auto";
}

/**
 * WhatIDoItem Molecule
 * Represents a single domain of expertise in the "What I do" section.
 * - Mobile: Enclosed in a fixed-width box anchored to the left viewport edge with icon on the left.
 * - Desktop: Styled like the skills section on the About page with an icon in the bordered title and description below.
 */
export default function WhatIDoItem({
    item,
    isMobile = false,
    width,
    className = "",
    layout = "auto",
}: WhatIDoItemProps) {
    const Icon = item.icon;
    const contentText = item.description || item.text;
    const resolvedLayout = layout === "auto" ? (isMobile ? "mobile" : "desktop") : layout;

    if (resolvedLayout === "desktop") {
        return (
            <div className={`flex flex-col gap-2 group ${className}`}>
                <div className="border-b border-(--border-color) pb-2 mb-2 flex flex-col items-start gap-2.5">
                    <Icon
                        size={26}
                        className="text-(--color-accent-solid) group-hover:text-(--txt-highlight-color) transition-colors shrink-0"
                    />
                    <h3 className="title text-xl lg:text-2xl text-(--txt-title-color) group-hover:text-(--txt-highlight-color) transition-colors leading-snug">
                        {item.title}
                    </h3>
                </div>
                {contentText && (
                    <div className="text-sm lg:text-base text-(--txt-subtitle-color) font-sans leading-relaxed">
                        {contentText}
                    </div>
                )}
            </div>
        );
    }

    const resolvedWidth = width || item.width || "w-full max-w-md";

    return (
        <div
            className={`box-border flex items-start gap-3.5 pl-4 pr-4 py-3.5 bg-(--bg-card) border border-(--border-color) border-l-0 rounded-r-xl rounded-l-none shadow-xs hover:shadow-sm hover:border-(--border-focus) hover:bg-(--bg-interactive-hover) hover:translate-x-1.5 transition-all duration-200 group cursor-default select-none ${resolvedWidth} ${className}`}
        >
            <Icon
                size={22}
                className="text-(--color-accent-solid) group-hover:text-(--txt-highlight-color) transition-colors shrink-0 mt-0.5"
            />
            <div className="flex flex-col min-w-0 flex-1">
                <h3 className="title !text-base font-medium text-(--txt-title-color) group-hover:text-(--txt-highlight-color) transition-colors leading-snug">
                    {item.title}
                </h3>
                {contentText && (
                    <div className="text-xs text-(--txt-subtitle-color) font-sans leading-relaxed mt-1 break-words">
                        {contentText}
                    </div>
                )}
            </div>
        </div>
    );
}
