export default function ProjectLink(props: {value:string, url:string}) {
    return (
        <div className='text-sm font-bold text-[var(--txt-link-color)]'><a href={props.url} target='_blank'>{`{ ${props.value} }`}</a></div>
    )
}