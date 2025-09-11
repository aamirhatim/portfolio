export default function Chip(props: {text:string}) {
    return (
        <div className="box-border px-2 border border-[var(--txt-subtitle-color)] text-[var(--txt-subtitle-color)] rounded-full text-xs">
            {props.text}
        </div>
    )
}