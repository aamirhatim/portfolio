import Chip from "../atoms/Chip";

/**
 * Props for the ChipGroup component.
 */
export interface ChipGroupProps {
    /** List of string tags/keywords to render as Chips. */
    list: string[];
    /** Sizing configuration passed down to each Chip. */
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Renders a wrapped grid layout containing a group of Chips.
 */
export default function ChipGroup({ list, size = "sm" }: ChipGroupProps) {
    const gapSize = size === "lg" ? "gap-3" : "gap-2";

    return (
        <div className={`flex flex-wrap ${gapSize}`}>
            {list.map((s, idx) => (
                <Chip key={idx} text={s} size={size} />
            ))}
        </div>
    );
}