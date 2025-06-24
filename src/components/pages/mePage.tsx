import { shuffle } from 'lodash'
import { skillSet } from '../../data/skillsData'
import { Skill } from "../../data/datatypes"
import SkillItem from "../atoms/SkillItem/SkillItem"

function createSkill(skill: Skill) {
    const key = 'skill-' + skill.value.toLowerCase().replace(' ', '-')

    return(
        <SkillItem key={key} value={skill.value} type={skill.type} />
    )
}

export default function MePage() {
    // Shuffle skills
    const skillsShuffle = shuffle(skillSet)

    return (
        <div className="flex flex-col gap-30">
            <section className='flex flex-wrap gap-2'>
                { skillsShuffle.map( (s) => createSkill(s) ) }
            </section>
        </div>
    )
}