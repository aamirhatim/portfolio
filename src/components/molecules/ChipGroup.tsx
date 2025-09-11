import Chip from "../atoms/Chip"

export default function ChipGroup(props: {list:Array<string>}) {
    return (
        <div className="flex flex-wrap gap-2">
            {props.list.map( (s, idx) => <Chip key={idx} text={s} /> )}
        </div>
    )
}