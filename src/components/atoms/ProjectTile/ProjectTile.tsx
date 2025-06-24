import { ProjectType } from '../../../data/datatypes'
import ProjLinkChip from '../ProjLinkChip/ProjLinkChip'
import ProjSkill from '../ProjSkill/ProjSkill'

function ProjectTile(props: {project:ProjectType}) {

    function createProjSkill(skill:string) {
        const key = 'proj-skill-'+skill.toLowerCase().replace(' ', '-')

        return <ProjSkill key={key} value={skill} />
    }

    return (
        <div className={'box-border border rounded-xl p-4 flex gap-4'}>
            <div className='h-50 min-w-60 rounded-xl bg-amber-800'></div>

            <div className='flex flex-col gap-2'>
                <div className={'font-bold text-xl'}>{props.project.title}</div>

                <div className='flex flex-wrap gap-1'>
                    {props.project.skills.map( (s) => createProjSkill(s) )}
                </div>

                {props.project.code && <ProjLinkChip value='Code' url={props.project.code} />}
                {props.project.video && <ProjLinkChip value='Video' url={props.project.video} />}
                
                <div className='text-md mt-4'>{props.project.description}</div>
            </div>
        </div>
    )
}

export default ProjectTile