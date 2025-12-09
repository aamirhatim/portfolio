export interface ChipProps {
    text: string,
    size?: string,
}

export default function Chip(props:ChipProps) {
    const commonClasses = `box-border border border-(--txt-subtitle-color) text-(--txt-subtitle-color) rounded-md`;
    
    const chipClasses = props.size === "lg"
        ? `${commonClasses} px-4 py-1 text-xl`
        : `${commonClasses} px-2 text-xs`;

    return (
        <div className={chipClasses}>
            {props.text}
        </div>
    )
}