import { ProjectType } from '../../data/datatypes'
import ChipGroup from './ChipGroup'
import ProjectLink from '../atoms/ProjectLink'
import useIsMobile from '../../lib/hooks/useIsMobile';
import ArrowBtn from '../atoms/ArrowBtn';
import ProjectPopup from './ProjectPopup';
import { useRef, useCallback, useEffect } from 'react';
import { Star } from 'lucide-react';


export default function ProjectItem(props: { project: ProjectType; hasFirestoreArticle?: boolean }) {
    // Get context
    const isMobile = useIsMobile();
    const project = props.project;

    // Check if an article exists for the project
    const hasArticle = props.hasFirestoreArticle;

    const hasLinks = project.code || project.video || hasArticle;

    // Create refs
    const projectItemRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const frameIdRef = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (frameIdRef.current) {
                cancelAnimationFrame(frameIdRef.current);
            }
        };
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (projectItemRef.current) {
            rectRef.current = projectItemRef.current.getBoundingClientRect();
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!projectItemRef.current) return;

        if (!rectRef.current) {
            rectRef.current = projectItemRef.current.getBoundingClientRect();
        }

        const rect = rectRef.current;
        if (rect.width === 0 || rect.height === 0) return;

        // Calculate X and Y coordinates relative to the center of the card
        // Normalize between -1 and 1
        const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

        if (frameIdRef.current) {
            cancelAnimationFrame(frameIdRef.current);
        }

        frameIdRef.current = requestAnimationFrame(() => {
            if (projectItemRef.current) {
                projectItemRef.current.style.setProperty('--parallax-x', `${-x}`);
                projectItemRef.current.style.setProperty('--parallax-y', `${-y}`);
            }
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        rectRef.current = null;
        if (frameIdRef.current) {
            cancelAnimationFrame(frameIdRef.current);
        }
        if (!projectItemRef.current) return;
        projectItemRef.current.style.setProperty('--parallax-x', `0`);
        projectItemRef.current.style.setProperty('--parallax-y', `0`);
    }, []);

    const desktopLayout = (
        <div
            id={project.id}
            ref={projectItemRef}
            className={`group relative box-border w-full flex hover:z-50`}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ '--parallax-x': 0, '--parallax-y': 0 } as React.CSSProperties}
        >
            <div className="absolute inset-0 bg-(--color-accent-bg-subtle) rounded-xl"></div>

            <ProjectPopup refDiv={projectItemRef} projectId={project.id} />

            <div
                className='relative z-10 flex flex-col w-full gap-1 p-6 border border-transparent group-hover:border-(--border-color) bg-(--bg-color) rounded-xl transition-all duration-200 ease-out'
                style={{ transform: 'translate(calc(var(--parallax-x) * 40px), calc(var(--parallax-y) * 40px))' }}
            >
                <div className='flex flex-wrap items-center gap-6'>
                    <div className='relative'>
                        <h3 className={'title text-2xl font-medium'}>{project.title}</h3>
                    </div>

                    <div className='flex gap-2 pr-10 items-center'>
                        {project.spotlight && (
                            <div className="p-1 flex items-center justify-center" title="Featured Project">
                                <Star size={16} className='text-(--txt-highlight-color)' />
                            </div>
                        )}
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
        </div>
    );

    const mobileLayout = (
        <div className='p-4 flex flex-col gap-6 border border-(--border-color) rounded-xl relative'>
            {project.spotlight && (
                <div className="absolute top-4 right-4 p-1 flex items-center justify-center" title="Featured Project">
                    <Star size={20} className='text-(--txt-highlight-color)' />
                </div>
            )}
            <div className={project.spotlight ? 'pr-8' : ''}>
                <h3 className={'title text-2xl font-medium'}>{project.title}</h3>
                <div className={'text-lg italic text-(--txt-subtitle-color)'}>{project.subtitle}</div>
            </div>

            <ChipGroup list={project.skills} />
            <div className='text-lg'>{project.description}</div>


            {hasLinks &&
                <div className='flex gap-3 justify-center items-center'>
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