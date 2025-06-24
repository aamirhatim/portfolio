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
        <div className="flex flex-col gap-20">
            <section>
                <div className='rounded-xl bg-amber-600 w-[30%] min-w-60 h-40'></div>
            </section>

            <section className='text-lg'>
                About me
            </section>

            <section className='flex flex-col'>
                <div className='text-3xl font-bold mb-7'>My expertise</div>
                <div className='flex flex-wrap gap-2'>
                    { skillsShuffle.map( (s) => createSkill(s) ) }
                </div>
            </section>
        </div>
    )
}