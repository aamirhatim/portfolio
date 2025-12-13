import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";
import { ProjectType } from "../../data/datatypes"
import useIsMobile from "../../lib/hooks/useIsMobile";
import ChipGroup from "./ChipGroup";
import { useCallback, useMemo, useRef } from "react";
import ProjectPopup from "./ProjectPopup";
import { motion } from "motion/react";
import usePreferredColorScheme from "../../lib/hooks/usePreferredColorScheme";

export default function ProjectHighlight(props: {project:ProjectType, idx:number}) {
    // Get context
    const { setNavSelect } = useAppContext();
    const navigate = useNavigate();
    const isMobile = useIsMobile();
    const { scheme, colorToHex } = usePreferredColorScheme();

    // Create refs
    const highlightRef = useRef<HTMLDivElement>(null);

    // Animation config
    const motionConfig = useMemo(() => {
        const defaultPadding = isMobile ? '16px' : '40px';
        const hoverPadding = isMobile ? '24px' : '48px';

        const initial = {
            opacity: 0,
            y: 50,
            color: colorToHex('--txt-body-color'),
            paddingLeft: defaultPadding,
            paddingRight: defaultPadding
        }
        const whileInView = {
            opacity: 1,
            y: 0,
            paddingLeft: defaultPadding,
            paddingRight: defaultPadding,
            transition: { duration: .3, easing: "easeOut" }
        }
        const viewport = {
            once: true,
            amount: .5
        }
        const hover = {
            paddingLeft: hoverPadding,
            color: colorToHex('--txt-highlight-color'),
            transition: { duration: .15 }
        }

        return {initial, whileInView, viewport, hover}
    }, [scheme, isMobile, colorToHex]);

    // Nav handler
    const handleNav = useCallback(() => {
        setNavSelect(`projects/${props.project.id}`);
        navigate(`/projects/${props.project.id}`);
    }, [props.project.id, setNavSelect, navigate]);

    const desktopLayout = (
        <motion.div
            ref={highlightRef}
            key={scheme}
            className={`relative box-border flex items-center justify-between gap-2 py-2 border-b border-b-(--border-color)`}
            initial={motionConfig.initial}
            whileInView={motionConfig.whileInView}
            viewport={motionConfig.viewport}
            whileHover={motionConfig.hover}
        >
            <ProjectPopup refDiv={highlightRef} projectId={props.project.id} />
            <div className="cursor-pointer title text-lg" onClick={handleNav}>{props.project.title}</div>
            <ChipGroup list={props.project.skills} />
        </motion.div>
    );

    const mobileLayout = (
        <motion.div
            ref={highlightRef}
            key={scheme}
            className="relative cursor-pointer w-full pb-4 flex flex-col gap-2 border-b border-b-(--border-color)" 
            onClick={handleNav}
            initial={motionConfig.initial}
            whileInView={motionConfig.whileInView}
            viewport={motionConfig.viewport}
        >
            <div className="title text-lg">{props.project.title}</div>
        </motion.div>
    )
    
    return (
        <>
        {isMobile ? mobileLayout : desktopLayout}
        </>
    )
}