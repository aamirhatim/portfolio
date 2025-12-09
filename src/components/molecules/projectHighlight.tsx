import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";
import { ANIMATION_DURATION_MS } from "../../data/constants";
import { ProjectType } from "../../data/datatypes"
import LazyImg from "../atoms/LazyImg";
import useIsMobile from "../hooks";
import ChipGroup from "./ChipGroup";
import { useRef } from "react";
import ProjectPopup from "./ProjectPopup";

export default function ProjectHighlight(props: {project:ProjectType}) {
    // Get context
    const { setNavSelect } = useAppContext();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // Create refs
    const highlightRef = useRef<HTMLDivElement>(null);

    // Define image paths
    const imgPath = `/proj_img/${props.project.img}`;
    const placeholderPath = `/proj_thumbs/${props.project.img}`;

    // Define hover styles
    const hoverClasses = `transition-all duration-[${ANIMATION_DURATION_MS}ms] ease-in-out hover:pl-6`;

    // Nav handler
    const handleNav = () => {
        setNavSelect(`projects/${props.project.id}`);
        navigate(`/projects/${props.project.id}`);
    };

    const desktopLayout = (
        <div ref={highlightRef} className={`relative box-border flex items-center gap-1 pl-0 py-2 border-b border-b-(--border-color) ${hoverClasses}`}>
            <ProjectPopup refDiv={highlightRef} projectId={props.project.id} />
            <div className="cursor-pointer text-md font-bold text-[var(--txt-title-color)]" onClick={handleNav}>{props.project.title}</div>
            <ChipGroup list={props.project.skills} />
        </div>
    );

    const mobileLayout = (
        <div className="relative w-full h-75" onClick={handleNav}>
            <LazyImg
                imgPath={imgPath}
                alt="Project Image"
                className="h-full w-full"
                placeholderPath={placeholderPath}                
            />

            <div className="absolute top-0 left-0 p-10 h-full w-full flex flex-col justify-between gap-4 bg-gradient-to-t from-[rgba(0,0,0,.80)] from-40% to-[rgba(0,0,0,0.01)]">
                <div className="text-3xl font-bold text-[var(--txt-title-color)]">{props.project.title}</div>
                <div className="text-lg">{props.project.description}</div>
            </div>
        </div>
    )
    
    return (
        <>
        {isMobile ? mobileLayout : desktopLayout}
        </>
    )
}