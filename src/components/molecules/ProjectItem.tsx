import { ProjectType } from '../../data/datatypes'
import ChipGroup from './ChipGroup'
import ProjectLink from '../atoms/ProjectLink'
import useIsMobile from '../hooks';
import { ANIMATION_DURATION_MS } from '../../data/constants';
import ArrowBtn from '../atoms/ArrowBtn';
import { motion } from 'framer-motion';
import ProjectPopup from './ProjectPopup';
import { useRef } from 'react';

export default function ProjectItem(props: {project:ProjectType, idx:number}) {
    // Get context
    const isMobile = useIsMobile();
    const hasLinks = props.project.code || props.project.video || props.project.article;

    // Create refs
    const projectItemRef = useRef<HTMLDivElement>(null);

    // Define hover styles
    const hoverClasses = `transition-all duration-[${ANIMATION_DURATION_MS}ms] ease-in-out`;

    // Animation config
    const desktopVariants = {
        hidden: {
            opacity: 0,
            x: 50,
            y: 30,
        },
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
        }
    };

    const mobileVariants = {
        hidden: {
            opacity: 0,
            y: 30,
        },
        visible: {
            opacity: 1,
            y: 0,
        }
    };

    const desktopLayout = (
        <div id={props.project.id} ref={projectItemRef} className={`relative box-border rounded-xl flex ${hoverClasses}`}>
            <ProjectPopup refDiv={projectItemRef} projectId={props.project.id} />

            <div className='flex flex-col w-full gap-1'>
                <div className='flex flex-wrap items-center gap-6'>
                    <div className={'title text-2xl text-(--txt-title-color)'}>{props.project.title}</div>

                    <div className='flex gap-2 pr-10'>
                        {props.project.code && <ProjectLink value='code' url={props.project.code} newTab={true} />}
                        {props.project.video && <ProjectLink value='video' url={props.project.video} newTab={true} />}
                        {props.project.article && <ProjectLink value='blog' url={`/projects/${props.project.id}`} />}
                    </div>
                </div>

                <div className='text-xl text-(--txt-subtitle-color) w-[80%] mb-4'>{props.project.description}</div>
                {props.project.article && <ArrowBtn text="Read the article" link="" className="mb-4 text-lg !text-(--txt-subtitle-color)" />}
                <ChipGroup list={props.project.skills} />
            </div>
        </div>
    );

    const mobileLayout = (
        <div className='p-4 flex flex-col gap-6 border border-(--border-color) rounded-xl'>
            <div className={'title text-2xl text-(--txt-title-color)'}>{props.project.title}</div>
            <ChipGroup list={props.project.skills} />
            <div className='text-lg'>{props.project.description}</div>

            
            {hasLinks &&
                <div className='flex gap-3 justify-center'>
                    {props.project.code && <ProjectLink value='Code' url={props.project.code} showText={true} />}
                    {props.project.video && <ProjectLink value='Video' url={props.project.video} showText={true} />}
                    {props.project.article && <ProjectLink value='Article' url={`/projects/${props.project.id}`} showText={true} />}
                </div>
            }
        </div>
    );

    return (
        <>
        {isMobile
            ? <motion.div
                variants={mobileVariants}
                initial="hidden"
                animate="visible"
                transition={{
                    type: "spring",
                    bounce: .4,
                    delay: props.idx * 0.1,
                    duration: .7
                }}
              >
                {mobileLayout}
              </motion.div>

            : <motion.div
                variants={desktopVariants}
                initial="hidden"
                animate="visible"
                transition={{
                    type: "spring",
                    bounce: .4,
                    delay: props.idx * 0.1,
                    duration: .7
                }}
              >
                {desktopLayout}
              </motion.div>
        }
        </>
    )
}