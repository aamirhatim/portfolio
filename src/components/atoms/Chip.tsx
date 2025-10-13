export interface ChipProps {
    text: string,
    size?: string,
}

export default function Chip(props:ChipProps) {
    const smallChip = (
        <div className="box-border px-2 border border-[var(--txt-subtitle-color)] text-[var(--txt-subtitle-color)] rounded-full text-xs">
            {props.text}
        </div>
    )

    const largeChip = (
        <div className="box-border px-2 border border-[var(--txt-subtitle-color)] text-[var(--txt-subtitle-color)] rounded-full text-xl">
            {props.text}
        </div>
    )

    return (
        <>
            {props.size === "lg" ? largeChip : smallChip}
        </>
    )
}