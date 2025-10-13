export interface ChipProps {
    text: string,
    size?: string,
}

export default function Chip(props:ChipProps) {
    const chipClasses = props.size === "lg"
        ? "box-border px-4 py-1 border border-[var(--txt-subtitle-color)] text-[var(--txt-subtitle-color)] rounded-full text-xl"
        : "box-border px-2 border border-[var(--txt-subtitle-color)] text-[var(--txt-subtitle-color)] rounded-full text-xs";

    return (
        <div className={chipClasses}>
            {props.text}
        </div>
    )
}