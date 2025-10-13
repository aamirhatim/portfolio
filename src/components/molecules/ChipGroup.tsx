import Chip from "../atoms/Chip"

export interface ChipGroupProps {
    list: string[],
    size?: string,
}

export default function ChipGroup(props:ChipGroupProps) {
    const gapSize = props.size === "lg" ? "gap-3" : "gap-2";

    return (
        <div className={`flex flex-wrap ${gapSize}`}>
            {props.list.map( (s, idx) => <Chip key={idx} text={s} size={props.size} /> )}
        </div>
    )
}