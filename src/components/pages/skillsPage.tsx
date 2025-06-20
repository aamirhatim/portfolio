import { shuffle } from 'lodash'
import { Skill } from '../../data/datatypes'
import { skillSet, skillDescriptions } from '../../data/skillsData'
import SkillItem from '../atoms/SkillItem/SkillItem'
import SkillType from '../atoms/SkillType/SkillType'

function createSkill(skill: Skill) {
    const key = 'skill-' + skill.value.toLowerCase().replace(' ', '-')

    return(
        <SkillItem key={key} value={skill.value} type={skill.type} />
    )
}

export default function SkillsPage() {
    // Shuffle skills
    const skillsShuffle = shuffle(skillSet)

    return (
        <>
            <section className='mb-15 flex flex-wrap justify-center gap-8'>
                <SkillType title='Code' description={skillDescriptions.code} />
                <SkillType title='Concepts' description={skillDescriptions.concepts} />
                <SkillType title='Tools' description={skillDescriptions.tools} />
            </section>
            
            <section className='flex flex-wrap justify-center gap-2'>
                { skillsShuffle.map( (s) => createSkill(s) ) }
            </section>
        </>
    )
}