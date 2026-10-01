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

    // Keyboard handler for accessible navigation
    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNav();
        }
    }, [handleNav]);

    const desktopLayout = (
        <div
            ref={highlightRef}
            onClick={handleNav}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            className={`cursor-pointer relative box-border flex items-center justify-between gap-2 py-2 border-b border-b-(--border-color) text-(--txt-body-color) hover:text-(--txt-highlight-color) transition-all duration-150 hover:pl-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-(--border-focus)`}
        >
            <ProjectPopup refDiv={highlightRef} projectId={props.project.id} />
            <div className="title text-lg w-fit">{props.project.title}</div>
            <ChipGroup list={props.project.skills} />
        </div>
    );

    const mobileLayout = (
        <div
            ref={highlightRef}
            className="relative cursor-pointer w-full pb-4 flex flex-col gap-2 border-b border-b-(--border-color) text-(--txt-body-color) hover:text-(--txt-highlight-color) transition-all duration-150 hover:pl-4 focus:outline-none focus-visible:ring-1 focus-visible:ring-(--border-focus)"
            onClick={handleNav}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <div className="title text-lg w-fit">{props.project.title}</div>
        </div>
    );

    return (
        <>
            {isMobile ? mobileLayout : desktopLayout}
        </>
    )
}