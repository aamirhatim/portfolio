import "./SkillChips.style.scss"
import SkillChip from "../../atoms/SkillChip/SkillChip"

function SkillChips( {chips}:{chips:string[]}) {
    return (
        <div className="skill-chips">
            {chips.map( (chip) => {
                return(<SkillChip value={chip} />)
            })}
        </div>
    )
}

export default SkillChips