import { useParams } from "react-router"
import ProjectArticle from "../organisms/ProjectArticle";
import { ANIMATION_DURATION_MS } from "./AppLayout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";

export default function ProjectViewer() {
    // Get params
    const params = useParams();
    const projectId = params.projectId!;

    const bumperClasses = `box-border flex flex-col justify-end shrink-0 w-[10%]`;
    const arrowClasses = `p-2 hover:scale-130 hover:text-[var(--txt-title-color)] transition-all duration-[${ANIMATION_DURATION_MS}ms]`;

    return (
        <div className="box-border flex min-h-full w-full z-90">
            <div className={`${bumperClasses} items-start`}>
                <div className={arrowClasses}><FontAwesomeIcon icon={faArrowAltCircleLeft} size="2xl" /></div>
            </div>

            <div className="grow-1 shrink-0"><ProjectArticle projectId={projectId} /></div>

            <div className={`${bumperClasses} items-end`}>
                <div className={arrowClasses}><FontAwesomeIcon icon={faArrowAltCircleRight} size="2xl" /></div>
            </div>
        </div>
    )
}