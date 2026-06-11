export interface ChipProps {
    text: string,
    size?: string,
    classes?: string
}

export default function Chip(props: ChipProps) {

    // Define chip style classes
    const commonClasses = `box-border ${props.classes} rounded-md transition-all duration-150 hover:scale-105`;
    const chipClasses = props.size === "lg"
        ? `${commonClasses} px-4 py-1 text-xl`
        : `${commonClasses} px-2 text-xs`;

    return (
        <div className={chipClasses}>
            {props.text}
        </div>
    )
}