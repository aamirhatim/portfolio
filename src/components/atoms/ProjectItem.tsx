import { useEffect, useRef } from 'react'
import { ProjectType } from '../../data/datatypes'
import ChipGroup from '../molecules/ChipGroup'
import ProjectLink from './ProjectLink'
import LazyImg from './LazyImg';

export default function ProjectItem(props: {project:ProjectType}) {
    // Create refs
    const imgRef = useRef<HTMLDivElement>(null);

    // Set project bg image
    useEffect( () => {
        if (!imgRef.current || !props.project.img) return;

        const img = imgRef.current;
        const imgPath = `/project_img/${props.project.img}`;
        img.style.backgroundImage = `url(${imgPath})`;
        img.style.backgroundSize = "cover";
        img.style.backgroundPosition = "center";
    }, []);

    return (
        <div className={'box-border rounded-xl p-4 flex gap-4'}>
            <LazyImg
                imgPath={`/proj_img/baxter.jpg`}
                alt={'Project image'}
                placeholderSrc={'/project_img/teleops.jpg'}
                className='box-border border border-[var(--border-color)] min-h-50 min-w-60 rounded-xl'
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