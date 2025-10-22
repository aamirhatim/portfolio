import { ProjectType } from '../../data/datatypes'
import ChipGroup from '../molecules/ChipGroup'
import ProjectLink from './ProjectLink'
import LazyImg from './LazyImg';

export default function ProjectItem(props: {project:ProjectType}) {
    // Define image paths
    const imgPath = `/proj_img/${props.project.imgPath}`;
    const placeholderPath = `/proj_thumbs/${props.project.imgPath}`;

    return (
        <div className={'box-border p-4 flex gap-4'}>
            <LazyImg
                imgPath={imgPath}
                alt={'Project image'}
                placeholderPath={placeholderPath}
                className='box-border border border-[var(--border-color)] rounded-xl overflow-hidden h-50 w-60 grow-0 shrink-0'
            />

            <div className='flex flex-col gap-2'>
                <div className='flex flex-wrap items-center gap-2'>
                    <div className={'font-bold text-xl text-[var(--txt-title-color)]'}>{props.project.title}</div>
                    {props.project.code && <ProjectLink value='Code' url={props.project.code} />}
                    {props.project.video && <ProjectLink value='Video' url={props.project.video} />}
                </div>

                <ChipGroup list={props.project.skills} />
                
                <div className='text-md mt-4'>{props.project.description}</div>
            </div>
        </div>
    )
}