import './SkillItem.style.scss'

function SkillItem(props: {value: string, type: string}) {
    return (
        <div className={'skill-item ' + props.type }>{props.value}</div>
    )
}

export default SkillItem