import './SkillSection.style.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

function SkillSection( { icons, desc } : { icons:IconDefinition, desc:string } ) {
    return (
        <div className='skill-section'>
            <FontAwesomeIcon icon={icons} />
            <p>{desc}</p>
        </div>
    )
}

export default SkillSection