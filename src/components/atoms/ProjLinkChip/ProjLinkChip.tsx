export default function ProjLinkChip(props: {value:string, url:string}) {
    return (
        <div className='text-md font-bold'><a href={props.url} target='_blank'>{props.value}</a></div>
    )
}