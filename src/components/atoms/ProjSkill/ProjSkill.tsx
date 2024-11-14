import './ProjSkill.style.scss'

function ProjSkill(props: {value:string}) {
    return (
        <div className='proj-skill'>{props.value}</div>
    )
}

export default ProjSkill