import './SkillType.style.scss'

function SkillType(props: {title: string, description: string}) {

    return (
        <div className='skill-type'>
            <div className={'skill-title ' + props.title.toLowerCase()}>{props.title}</div>
            <div className='skill-description'>{props.description}</div>
        </div>
    )
}

export default SkillType