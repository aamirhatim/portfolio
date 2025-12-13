import { useNavigate, useParams } from "react-router"
import ProjectArticle from "../organisms/ProjectArticle";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowAltCircleLeft, faArrowAltCircleRight } from "@fortawesome/free-solid-svg-icons";
import { useCallback, useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib";
import { useAppContext } from "../../context/appContext";
import { ANIMATION_DURATION_MS } from "../../data/constants";

export default function ProjectViewer() {
    // Get params
    const params = useParams();
    const projectId = params.projectId!;

    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const { setNavSelect } = useAppContext();
    const navigate = useNavigate();

    // Init state
    const [projectList, setProjectList] = useState<string[]>([]);

    const arrowClasses = `cursor-pointer hover:scale-130 hover:text-(--txt-title-color) transition-all duration-[${ANIMATION_DURATION_MS}ms]`;

    // Get current index of project
    const currentIndex = projectList.indexOf(projectId);
    const [transitionDir, setTransitionDir] = useState<"next"|"prev">("next");

    // Define boundary conditions
    const isFirstProject = currentIndex === 0;
    const isLastProject = currentIndex === projectList.length - 1;

    // Helper to fetch project list
    const getProjectList = useCallback(async () => {
        const projectDocs = await getDocumentsFromCollection(firebaseAppContext, "projects");
        const newList = projectDocs?.map(p => p.id) || [];
        setProjectList(newList);
    }, [firebaseAppContext, setProjectList]);

    // Get list of all projects
    useEffect(() => {
        getProjectList();
    }, [getProjectList]);

    // Define nav buttons
    const navProject = useCallback((direction: "next"|"prev") => {
        if (projectList.length === 0) return;

        setTransitionDir(direction);
        let newIndex = currentIndex;
        let shouldNavigate = false;

        // Check if direction is valid
        if (direction === "next" && !isLastProject) {
            newIndex += 1;
            shouldNavigate = true;
        } else if (direction === "prev" && !isFirstProject) {
            newIndex -= 1;
            shouldNavigate = true;
        }

        // Don't navigate if nav flag is false
        if (!shouldNavigate) return;

        // Navigate to new project
        const nextProjectId = projectList[newIndex];
        navigate(`/projects/${nextProjectId}`);
        setNavSelect(`projects/${nextProjectId}`);
    }, [currentIndex, projectList, navigate, isFirstProject, isLastProject]);

    return (
        <div className="h-full w-full flex flex-col justify-between z-90 mx-auto">
            <ProjectArticle projectId={projectId} transitionDir={transitionDir} />

            <div className="flex w-full px-[15%] py-20 justify-between">
                <div className={`${arrowClasses} left-0 justify-end ${isFirstProject && 'opacity-30'}`} onClick={() => navProject("prev")}>
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2xl" />
                </div>

                <div className={`${arrowClasses} right-0 justify-start ${isLastProject && 'opacity-30'}`} onClick={() => navProject("next")}>
                    <FontAwesomeIcon icon={faArrowAltCircleRight} size="2xl" />
                </div>
            </div>
        </div>
    )
}