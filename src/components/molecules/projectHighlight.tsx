import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";
import { ProjectType } from "../../data/datatypes"
import useIsMobile from "../../lib/hooks/useIsMobile";
import ChipGroup from "./ChipGroup";
import { useCallback, useRef } from "react";
import ProjectPopup from "./ProjectPopup";

export default function ProjectHighlight(props: { project: ProjectType, idx: number }) {
    // Get context
    const { setNavSelect } = useAppContext();
    const navigate = useNavigate();
    const isMobile = useIsMobile();

    // Create refs
    const highlightRef = useRef<HTMLDivElement>(null);

    // Nav handler
    const handleNav = useCallback(() => {
        setNavSelect(`projects/${props.project.id}`);
        navigate(`/projects/${props.project.id}`);
    }, [props.project.id, setNavSelect, navigate]);

    const desktopLayout = (
        <div
            ref={highlightRef}
            className={`relative box-border flex items-center justify-between gap-2 py-2 border-b border-b-(--border-color) text-(--txt-body-color) hover:text-(--txt-highlight-color) transition-all duration-150 hover:pl-4`}
        >
            <ProjectPopup refDiv={highlightRef} projectId={props.project.id} />
            <div className="cursor-pointer title text-lg" onClick={handleNav}>{props.project.title}</div>
            <ChipGroup list={props.project.skills} />
        </div>
    );

    const mobileLayout = (
        <div
            ref={highlightRef}
            className="relative cursor-pointer w-full pb-4 flex flex-col gap-2 border-b border-b-(--border-color) text-(--txt-body-color) hover:text-(--txt-highlight-color) transition-all duration-150 hover:pl-4"
            onClick={handleNav}
        >
            <div className="title text-lg">{props.project.title}</div>
        </div>
    )

    return (
        <>
            {isMobile ? mobileLayout : desktopLayout}
        </>
    )
}