import './Projects.style.scss'
import projectList from '../../../data/projectData'
import ProjectTile from '../../atoms/ProjectTile/ProjectTile'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ProjectType } from '../../../data/datatypes'
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons'

function hexToRgb(val:string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(val);
    if ( result ) {
        return {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        }
    } else return null;
}

function createGradientSteps(start:string, end:string, steps:number) {
    const startRGB = hexToRgb(start)
    const endRGB = hexToRgb(end)

    if ( !startRGB || !endRGB ) {
        throw new Error('Invalid start or end RGB value')
    }

    // Calculate step increments for each color channel
    const rStep = (endRGB.r - startRGB.r) / (steps - 1)
    const gStep = (endRGB.g - startRGB.g) / (steps - 1)
    const bStep = (endRGB.b - startRGB.b) / (steps - 1)

    // Generate gradient steps
    const gradient = []
    for (let i = 0; i < steps; i++) {
        const r = Math.round(startRGB.r + rStep * i)
        const g = Math.round(startRGB.g + gStep * i)
        const b = Math.round(startRGB.b + bStep * i)
        gradient.push(`rgb(${r}, ${g}, ${b})`);
    }

    return gradient
}

function Projects() {

    function createProject(project:ProjectType, color:string) {
        const key = 'proj-' + project.id
        return <ProjectTile key={key} project={project} color={color} />
    }

    const colorSteps: Array<string> = createGradientSteps('#036bfc', '#db03fc', projectList.length)

    return (
        <div id='projects' className='content'>
            <div id='proj-header'>
                <FontAwesomeIcon icon={faAnglesRight} /> 
                <p>
                    You can also check out some of my work on <a href='https://github.com/aamirhatim' target='_blank'>Github</a>
                </p>
            </div>
            {projectList.map( (p, i) => createProject(p, colorSteps[i]) )}
        </div>
    )
}

export default Projects