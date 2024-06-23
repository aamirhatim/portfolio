import "./SkillChip.scss"

function SkillChip( {value}:{value:string} ) {
    return (
        <h5 className="skill-chip">{value}</h5>
    )
}

export default SkillChip