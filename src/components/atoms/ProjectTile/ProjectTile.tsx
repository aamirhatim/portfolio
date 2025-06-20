import { ProjectType } from '../../../data/datatypes'
import ProjLinkChip from '../ProjLinkChip/ProjLinkChip'
import ProjSkill from '../ProjSkill/ProjSkill'

function ProjectTile(props: {project:ProjectType, highlight?:boolean}) {

    function createProjSkill(skill:string) {
        const key = 'proj-skill-'+skill.toLowerCase().replace(' ', '-')

        return <ProjSkill key={key} value={skill} />
    }

    return (
        <div className={`box-border border rounded-xl p-8 flex flex-col justify-between min-w-100 ${props.highlight ? ' h-70 w-full' : 'h-90 basis-[49%]'}`}>
            <div>
                <div className='proj-title-box'>
                    <div className={`font-bold ${props.highlight ? 'text-3xl' : 'text-xl'}`}>{props.project.title}</div>
                    {props.project.code && <ProjLinkChip value='Code' url={props.project.code} />}
                    {props.project.video && <ProjLinkChip value='Video' url={props.project.video} />}
                </div>
                
                <div className='text-lg mt-4'>{props.project.description}</div>
            </div>

            <div className='flex flex-wrap gap-2'>
                {props.project.skills.map( (s) => createProjSkill(s) )}
            </div>
        </div>
    )
}

export default ProjectTile