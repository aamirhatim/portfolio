import { ProjectType } from '../../data/datatypes'
import ChipGroup from './ChipGroup'
import ProjectLink from '../atoms/ProjectLink'
import useIsMobile from '../../lib/hooks/useIsMobile';
import ArrowBtn from '../atoms/ArrowBtn';
import ProjectPopup from './ProjectPopup';
import { useRef, useState, useEffect } from 'react';
import { motion } from "motion/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStarOfLife } from '@fortawesome/free-solid-svg-icons';

// Create a map of all articles so we can check if one exists for the project
const articleModules = import.meta.glob("/src/data/articles/*.json");

export default function ProjectItem(props: { project: ProjectType }) {
    // Get context
    const isMobile = useIsMobile();
    const project = props.project;

    // State to check if an article exists
    const [hasArticle, setHasArticle] = useState(false);

    // Check if an article exists for the project
    useEffect(() => {
        const articlePath = `/src/data/articles/${props.project.id}.json`;
        if (articleModules[articlePath]) {
            setHasArticle(true);
        } else {
            setHasArticle(false);
        }
    }, [props.project.id]);

    const hasLinks = project.code || project.video || hasArticle;

    // Create refs
    const projectItemRef = useRef<HTMLDivElement>(null);

    // Animation config
    const hover = {
        scale: 1.02,
        transition: { duration: .1, easing: "easeOut" }
    }

    const desktopLayout = (
        <motion.div
            id={project.id}
            ref={projectItemRef}
            className={`box-border w-full flex`}
            whileHover={hover}
        >
            <ProjectPopup refDiv={projectItemRef} projectId={project.id} />

            <div className='flex flex-col w-full gap-1'>
                <div className='flex flex-wrap items-center gap-6'>
                    <div className='relative'>
                        <div className={'title text-2xl'}>{project.title}</div>
                        {project.spotlight && (
                            <div className='absolute top-0 right-full pt-1 pr-4 !text-(--txt-highlight-color)'>
                                <FontAwesomeIcon icon={faStarOfLife} size='xs' />
                            </div>
                        )}
                    </div>

                    <div className='flex gap-2 pr-10'>
                        {project.code && <ProjectLink value='code' url={project.code} newTab={true} />}
                        {project.video && <ProjectLink value='video' url={project.video} newTab={true} />}
                        {hasArticle && <ProjectLink value='blog' url={`/projects/${project.id}`} />}
                    </div>
                </div>

                <div className={'text-lg italic text-(--txt-subtitle-color) mb-4'}>{project.subtitle}</div>

                <div className='text-xl text-(--txt-subtitle-color) w-full mb-4'>{project.description}</div>
                {hasArticle && <ArrowBtn text="Read the article" link={`/projects/${project.id}`} className="mb-4 text-lg" />}
                <ChipGroup list={project.skills} />
            </div>
        </motion.div>
    );

    const mobileLayout = (
        <div className='p-4 flex flex-col gap-6 border border-(--border-color) rounded-xl relative'>
            {project.spotlight && (
                <div className='absolute top-4 right-4 !text-(--txt-highlight-color)'>
                    <FontAwesomeIcon icon={faStarOfLife} size='sm' />
                </div>
            )}
            <div>
                <div className={'title text-2xl'}>{project.title}</div>
                <div className={'text-lg italic text-(--txt-subtitle-color)'}>{project.subtitle}</div>
            </div>

            <ChipGroup list={project.skills} />
            <div className='text-lg'>{project.description}</div>


            {hasLinks &&
                <div className='flex gap-3 justify-center'>
                    {project.code && <ProjectLink value='Code' url={project.code} showText={true} />}
                    {project.video && <ProjectLink value='Video' url={project.video} showText={true} />}
                    {hasArticle && <ProjectLink value='Article' url={`/projects/${project.id}`} showText={true} />}
                </div>
            }
        </div>
    );

    return (
        <>
            {isMobile ? mobileLayout : desktopLayout}
        </>
    )
}