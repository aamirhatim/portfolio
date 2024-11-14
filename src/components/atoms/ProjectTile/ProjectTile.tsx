import { ProjectType } from '../../../data/datatypes'
import ProjLinkChip from '../ProjLinkChip/ProjLinkChip'
import ProjSkill from '../ProjSkill/ProjSkill'
import './ProjectTile.style.scss'

function ProjectTile(props: {project:ProjectType, color:string}) {

    function createProjSkill(skill:string) {
        const key = 'proj-skill-'+skill.toLowerCase().replace(' ', '-')

        return <ProjSkill key={key} value={skill} />
    }

    return (
        <div className='project-tile'>
            <div className='proj-title-box'>
                <div className='proj-title' style={{ color: props.color }}>{props.project.title}</div>
                {props.project.code && <ProjLinkChip value='Code' url={props.project.code} color={props.color} />}
                {props.project.video && <ProjLinkChip value='Video' url={props.project.video} color={props.color} />}
            </div>
            
            <div className='proj-desc'>{props.project.description}</div>

            <div className='proj-skill-box'>
                {props.project.skills.map( (s) => createProjSkill(s) )}
            </div>
        </div>
    )
}

export default ProjectTile