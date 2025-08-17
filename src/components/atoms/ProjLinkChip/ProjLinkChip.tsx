export default function ProjLinkChip(props: {value:string, url:string}) {
    return (
        <div className='text-sm font-bold text-lime-500'><a href={props.url} target='_blank'>{props.value}</a></div>
    )
}