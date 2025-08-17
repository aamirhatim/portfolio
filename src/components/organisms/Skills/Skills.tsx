import './Skills.stye.scss'
import { skillSet } from '../../../data/skillsData'
import shuffle from 'lodash/shuffle'
import { Skill } from '../../../data/datatypes'
import SkillItem from '../../atoms/SkillItem/SkillItem'
import SkillType from '../../atoms/SkillType/SkillType'

const descriptions = {
    concepts: "My current areas of focus are in human-machine interfaces, autonomous navigation and multi-agent control.",
    code: "In my day to day work I mostly use Python, and JavaScipt. I dabble in a little C++ as well.",
    tools: "My favorite tools are OnShape for CAD design, React for web development and ROS 2 for robotic applications."
}

function createSkill(skill: Skill) {
    const key = 'skill-' + skill.value.toLowerCase().replace(" ", "-")

    return(
        <SkillItem key={key} value={skill.value} type={skill.type} />
    )
}

function Skills() {
    const skills = shuffle(skillSet)

    return (
        <div id='skills' className='content'>
            <div id='skills-detail'>
                <SkillType title='Code' description={descriptions.code} />
                <SkillType title='Concepts' description={descriptions.concepts} />
                <SkillType title='Tools' description={descriptions.tools} />
            </div>

            <div id='skill-item-box'>
                { skills.map( (s) => createSkill(s) ) }
            </div>
        </div>
    )
}

export default Skills