import './Skills.style.scss'
import { useEffect } from 'react'
import { faLightbulb, faCode, faToolbox } from '@fortawesome/free-solid-svg-icons'

import SkillSection from '../../molecules/SkillSection/SkillSection'

const stickerNames = [
    "apple",
    "autonomous_nav",
    "solidworks",
    "cpp",
    "css",
    "docker",
    "eagle",
    "git",
    "graphic_design",
    "html",
    "ik",
    "ros",
    "illustrator",
    "js",
    "kubernetes",
    "latex",
    "lightroom",
    "linux",
    "mathematica",
    "matlab",
    "mechatronics",
    "microsoft",
    "ml",
    "robot_manip",
    "multi_control",
    "onshape",
    "oop",
    "photoshop",
    "php",
    "premierepro",
    "python",
    "hri",
    "react",
    "sql"
]

const descriptions = {
    concepts: "My current areas of focus are in human-machine interfaces, autonomous navigation and multi-agent control.",
    code: "In my day to day work I mostly use Python, HTML, CSS and JavaScipt. I dabble in a little C++ as well.",
    tools: "My favorite tools right now are OnShape for CAD design, React for web development and ROS 2 for robotic applications."
}

function Skills() {
    useEffect( () => {
        const stickerGrid = document.getElementById("sticker-grid")
        if ( stickerGrid != null ) {
            stickerGrid.innerHTML = ""
            stickerNames.forEach( n => {
                let s = document.createElement("img")
                s.src = `/src/assets/stickers/${n}_sticker.svg`
                s.className = "sticker"
                s.alt = n
                stickerGrid.appendChild(s)
            })
        }
    }, [stickerNames])

    return (
        <section id='skills'>
            <div id="sticker-grid"></div>
            
            <div id="skills-descriptions">
                <div id="title">Always learning new skills.</div>
                <SkillSection icons={faLightbulb} desc={descriptions.concepts} />
                <SkillSection icons={faCode} desc={descriptions.code} />
                <SkillSection icons={faToolbox} desc={descriptions.tools} />
            </div>
        </section>
    )
}

export default Skills