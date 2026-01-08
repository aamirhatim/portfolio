import { ProjectType } from '../../data/datatypes'
import ChipGroup from './ChipGroup'
import ProjectLink from '../atoms/ProjectLink'
import useIsMobile from '../../lib/hooks/useIsMobile';
import ArrowBtn from '../atoms/ArrowBtn';
import ProjectPopup from './ProjectPopup';
import { useRef, useState, useEffect } from 'react';
import { motion } from "motion/react";

// Create a map of all articles so we can check if one exists for the project
const articleModules = import.meta.glob("/src/data/articles/*.json");

export default function ProjectItem(props: { project: ProjectType }) {
    // Get context
    const isMobile = useIsMobile();

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

    const hasLinks = props.project.code || props.project.video || hasArticle;

    // Create refs
    const projectItemRef = useRef<HTMLDivElement>(null);

    // Animation config
    const initial = {
        opacity: 0,
        y: 50
    }
    const whileInView = {
        opacity: 1,
        y: 0,
        transition: { duration: .2, easing: "easeOut" }
    }
    const viewport = {
        once: true,
        amount: .5
    }
    const hover = {
        scale: 1.02,
        transition: { duration: .1, easing: "easeOut" }
    }

    const desktopLayout = (
        <motion.div
            id={props.project.id}
            ref={projectItemRef}
            className={`box-border w-full flex`}
            whileHover={hover}
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
        >
            <ProjectPopup refDiv={projectItemRef} projectId={props.project.id} />

            <div className='flex flex-col w-full gap-1'>
                <div className='flex flex-wrap items-center gap-6'>
                    <div className={'title text-2xl'}>{props.project.title}</div>

                    <div className='flex gap-2 pr-10'>
                        {props.project.code && <ProjectLink value='code' url={props.project.code} newTab={true} />}
                        {props.project.video && <ProjectLink value='video' url={props.project.video} newTab={true} />}
                        {hasArticle && <ProjectLink value='blog' url={`/projects/${props.project.id}`} />}
                    </div>
                </div>

                <div className='text-xl text-(--txt-subtitle-color) w-full mb-4'>{props.project.description}</div>
                {hasArticle && <ArrowBtn text="Read the article" link={`/projects/${props.project.id}`} className="mb-4 text-lg" />}
                <ChipGroup list={props.project.skills} />
            </div>
        </motion.div>
    );

    const mobileLayout = (
        <motion.div
            className='p-4 flex flex-col gap-6 border border-(--border-color) rounded-xl'
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
        >
            <div className={'title text-2xl'}>{props.project.title}</div>
            <ChipGroup list={props.project.skills} />
            <div className='text-lg'>{props.project.description}</div>


            {hasLinks &&
                <div className='flex gap-3 justify-center'>
                    {props.project.code && <ProjectLink value='Code' url={props.project.code} showText={true} />}
                    {props.project.video && <ProjectLink value='Video' url={props.project.video} showText={true} />}
                    {hasArticle && <ProjectLink value='Article' url={`/projects/${props.project.id}`} showText={true} />}
                </div>
            }
        </motion.div>
    );

    return (
        <>
            {isMobile ? mobileLayout : desktopLayout}
        </>
    )
}