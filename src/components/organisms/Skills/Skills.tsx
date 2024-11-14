import './Skills.stye.scss'
import { Skillset } from '../../../data/skills'
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
    const skillset = shuffle(Skillset)

    return (
        <div id='skills' className='content'>
            <div id='skills-detail'>
                <SkillType title='Code' description={descriptions.code} />
                <SkillType title='Concepts' description={descriptions.concepts} />
                <SkillType title='Tools' description={descriptions.tools} />
            </div>

            <div id='skill-item-box'>
                { skillset.map( (skill) => createSkill(skill) ) }
            </div>
        </div>
    )
}

export default Skills