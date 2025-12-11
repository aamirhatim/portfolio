import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";
import { ANIMATION_DURATION_MS } from "../../data/constants";
import { ProjectType } from "../../data/datatypes"
import useIsMobile from "../hooks";
import ChipGroup from "./ChipGroup";
import { useRef } from "react";
import ProjectPopup from "./ProjectPopup";

export default function ProjectHighlight(props: {project:ProjectType, idx:number}) {
    // Get context
    const { setNavSelect } = useAppContext();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // Create refs
    const highlightRef = useRef<HTMLDivElement>(null);

    // Define hover styles
    const hoverClasses = `transition-all duration-[${ANIMATION_DURATION_MS}ms] ease-in-out hover:pl-6 hover:text-(--txt-highlight-color)`;

    // Nav handler
    const handleNav = () => {
        setNavSelect(`projects/${props.project.id}`);
        navigate(`/projects/${props.project.id}`);
    };

    const desktopLayout = (
        <div ref={highlightRef} className={`relative box-border flex items-center justify-between gap-2 px-10 py-2 border-b border-b-(--border-color) ${hoverClasses}`}>
            <ProjectPopup refDiv={highlightRef} projectId={props.project.id} />
            <div className="cursor-pointer title text-lg" onClick={handleNav}>{props.project.title}</div>
            <ChipGroup list={props.project.skills} />
        </div>
    );

    const mobileLayout = (
        <div className="relative cursor-pointer w-full px-4 pb-4 flex flex-col gap-2 border-b border-b-(--border-color)" onClick={handleNav}>
            <div className="title text-lg">{props.project.title}</div>
        </div>
    )
    
    return (
        <>
        {isMobile ? mobileLayout : desktopLayout}
        </>
    )
}