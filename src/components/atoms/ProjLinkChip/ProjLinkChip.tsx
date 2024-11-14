import './ProjLinkChip.style.scss'

function ProjLinkChip(props: {value:string, url:string, color:string}) {
    return (
        <div className='proj-link-chip' style={{ backgroundColor: props.color }}><a href={props.url} target='_blank'>{props.value}</a></div>
    )
}

export default ProjLinkChip