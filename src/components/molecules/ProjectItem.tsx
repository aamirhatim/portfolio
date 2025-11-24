import { ProjectType } from '../../data/datatypes'
import ChipGroup from './ChipGroup'
import ProjectLink from '../atoms/ProjectLink'
import LazyImg from '../atoms/LazyImg';
import useIsMobile from '../hooks';
import { useAppContext } from '../../context/appContext';
import { ANIMATION_DURATION_MS } from '../../data/constants';

export default function ProjectItem(props: {project:ProjectType}) {
    // Get context
    const { setNavSelect } = useAppContext();
    const isMobile = useIsMobile();

    // Define image paths
    const imgPath = `/proj_img/${props.project.img}`;
    const placeholderPath = `/proj_thumbs/${props.project.img}`;

    const hoverClasses = `transition duration-[${ANIMATION_DURATION_MS}ms] ease-in-out hover:scale-[1.05] active:scale-[1.03]`;

    const desktopLayout = (
        <div className={`box-border flex gap-6 px-10 cursor-pointer ${hoverClasses}`} onClick={() => setNavSelect(`projects/${props.project.id}`)}>
            <LazyImg
                imgPath={imgPath}
                alt={'Project image'}
                placeholderPath={placeholderPath}
                className='box-border border border-(--border-color) rounded-xl overflow-hidden h-60 w-60 grow-0 shrink-0'
            />

            <div className='flex flex-col gap-2'>
                <div className='flex flex-wrap items-center gap-2'>
                    <div className={'font-bold text-xl text-(--txt-title-color)'}>{props.project.title}</div>
                    {props.project.code && <ProjectLink value='Code' url={props.project.code} />}
                    {props.project.video && <ProjectLink value='Video' url={props.project.video} />}
                </div>

                <ChipGroup list={props.project.skills} />
                
                <div className='text-md mt-4'>{props.project.description}</div>
            </div>
        </div>
    );

    const mobileLayout = (
        <div className='px-6 flex flex-col gap-4' onClick={() => setNavSelect(`projects/${props.project.id}`)}>
            <div className='relative flex flex-col rounded-xl overflow-hidden h-60 w-full border border-(--border-color)'>
                <LazyImg
                    imgPath={imgPath}
                    alt={'Project image'}
                    placeholderPath={placeholderPath}
                    className='box-border h-full w-full'
                />
                <div className='absolute top-0 left-0 box-border p-6 h-full w-full bg-gradient-to-t from-[rgba(0,0,0,.80)] from-40% to-[rgba(0,0,0,0)] flex flex-col gap-3 justify-end'>
                    <div className={'font-bold text-2xl text-(--txt-title-color)'}>{props.project.title}</div>
                    <div className='flex gap-3'>
                        {props.project.code && <ProjectLink value='Code' url={props.project.code} />}
                        {props.project.video && <ProjectLink value='Video' url={props.project.video} />}
                    </div>
                </div>
            </div>

            <div className='px-3 flex flex-col gap-4'>
                <div className='text-lg'>{props.project.description}</div>
                <ChipGroup list={props.project.skills} />
            </div>
        </div>
    );

    return (
        <>
        {isMobile ? mobileLayout : desktopLayout}
        </>
    )
}