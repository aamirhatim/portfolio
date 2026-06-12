export interface ChipProps {
    text: string,
    size?: string,
    classes?: string
}

export default function Chip(props: ChipProps) {

    // Define chip style classes
    const defaultClasses = props.classes || "border border-(--border-color) bg-(--bg-secondary-color) text-(--txt-subtitle-color)";
    const commonClasses = `box-border ${defaultClasses} rounded-md transition-all duration-150 hover:scale-105`;
    const chipClasses = props.size === "lg"
        ? `${commonClasses} px-4 py-1 text-xl`
        : `${commonClasses} px-2 text-xs`;

    return (
        <div className={chipClasses}>
            {props.text}
        </div>
    )
}