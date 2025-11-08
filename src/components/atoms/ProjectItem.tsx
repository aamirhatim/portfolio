import { ProjectType } from '../../data/datatypes'
import ChipGroup from '../molecules/ChipGroup'
import ProjectLink from './ProjectLink'
import LazyImg from './LazyImg';
import { ANIMATION_DURATION_MS } from '../pages/AppLayout';

export default function ProjectItem(props: {project:ProjectType}) {
    // Define image paths
    const imgPath = `/proj_img/${props.project.img}`;
    const placeholderPath = `/proj_thumbs/${props.project.img}`;

    const hoverClasses = `transition duration-[${ANIMATION_DURATION_MS}ms] ease-in-out hover:scale-[1.05] active:scale-[1.03]`;

    return (
        <div className={`box-border flex gap-6 px-10 cursor-pointer ${hoverClasses}`}>
            <LazyImg
                imgPath={imgPath}
                alt={'Project image'}
                placeholderPath={placeholderPath}
                className='box-border border border-[var(--border-color)] rounded-xl overflow-hidden h-60 w-60 grow-0 shrink-0'
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