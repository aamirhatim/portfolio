export interface ChipProps {
    text: string,
    size?: string,
}

export default function Chip(props:ChipProps) {
    // Define chip style classes
    const commonClasses = `box-border border text-(--txt-subtitle-color) rounded-md transition-all duration-150 hover:scale-105 hover:bg-(--bg-secondary-color)`;
    const chipClasses = props.size === "lg"
        ? `${commonClasses} px-4 py-1 text-xl`
        : `${commonClasses} px-2 text-xs`;

    return (
        <div className={chipClasses}>
            {props.text}
        </div>
    )
}