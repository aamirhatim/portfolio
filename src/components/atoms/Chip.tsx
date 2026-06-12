/**
 * Props for the Chip component.
 */
export interface ChipProps {
    /** The text content to display inside the chip. */
    text: string;
    /** The size of the chip. Defaults to 'sm'. */
    size?: 'sm' | 'md' | 'lg';
    /** Optional CSS class overrides for styling. */
    classes?: string;
}

/**
 * A standard, responsive Chip component used to display skills, keywords, and tags.
 */
export default function Chip({ text, size = "sm", classes }: ChipProps) {
    // Define chip style classes
    const defaultClasses = classes || "border border-(--border-color) bg-(--bg-secondary-color) text-(--txt-subtitle-color)";
    const commonClasses = `box-border ${defaultClasses} rounded-md transition-all duration-150 hover:scale-105`;
    
    const sizeMap: Record<'sm' | 'md' | 'lg', string> = {
        sm: "px-2 text-xs",
        md: "px-3 py-1 text-md",
        lg: "px-4 py-2 text-lg"
    };
    
    const chipClasses = `${commonClasses} ${sizeMap[size]}`;

    return (
        <div className={chipClasses}>
            {text}
        </div>
    );
}