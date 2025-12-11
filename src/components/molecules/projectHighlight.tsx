import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";
import { ProjectType } from "../../data/datatypes"
import useIsMobile from "../hooks";
import ChipGroup from "./ChipGroup";
import { useRef } from "react";
import ProjectPopup from "./ProjectPopup";
import { motion } from "motion/react";
import { cssVarToHex } from "../../lib/colorVars";

export default function ProjectHighlight(props: {project:ProjectType, idx:number}) {
    // Get context
    const { setNavSelect } = useAppContext();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // Create refs
    const highlightRef = useRef<HTMLDivElement>(null);

    // Animation config
    const initial = {
        opacity: 0,
        y: 50,
        color: cssVarToHex('--txt-body-color'),
        paddingLeft: `${isMobile ? '16px' : '40px'}`,
        paddingRight: `${isMobile ? '16px' : '40px'}`
    }
    const whileInView = {
        opacity: 1,
        y: 0,
        paddingLeft: `${isMobile ? '16px' : '40px'}`,
        paddingRight: `${isMobile ? '16px' : '40px'}`,
        transition: { duration: .3, easing: "easeOut" }
    }
    const viewport = {
        once: true,
        amount: .5
    }
    const hover = {
        paddingLeft: `${isMobile ? '24px' : '48px'}`,
        color: cssVarToHex('--txt-highlight-color'),
        transition: { duration: .15 }
    }

    // Nav handler
    const handleNav = () => {
        setNavSelect(`projects/${props.project.id}`);
        navigate(`/projects/${props.project.id}`);
    };

    const desktopLayout = (
        <motion.div
            ref={highlightRef}
            className={`relative box-border flex items-center justify-between gap-2 py-2 border-b border-b-(--border-color)`}
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
            whileHover={hover}
        >
            <ProjectPopup refDiv={highlightRef} projectId={props.project.id} />
            <div className="cursor-pointer title text-lg" onClick={handleNav}>{props.project.title}</div>
            <ChipGroup list={props.project.skills} />
        </motion.div>
    );

    const mobileLayout = (
        <motion.div
            ref={highlightRef}
            className="relative cursor-pointer w-full pb-4 flex flex-col gap-2 border-b border-b-(--border-color)" 
            onClick={handleNav}
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
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