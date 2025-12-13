import { useCallback, useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import ProjectItem from "../molecules/ProjectItem"
import { FirestoreDocType, ProjectType } from "../../data/datatypes";
import useIsMobile from "../../lib/hooks/useIsMobile";

export default function ProjectsPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();

    // Init state
    const [projectList, setProjectList] = useState<FirestoreDocType[]>([]);

    // Fetch projects
    const getProjects = useCallback(async () => {
        const projectList = await getDocumentsFromCollection(firebaseAppContext, "projects");
        if (!projectList) {
            setProjectList([]);
            return;
        }
        setProjectList(projectList);
    }, [setProjectList]);

    // Get list of projects
    useEffect( () => {
        getProjects();
    }, [getProjects]);

    return (
        <section className={`box-border flex flex-col px-4 ${isMobile ? 'gap-6 w-full' : 'gap-18 max-w-[800px] mx-auto'}`}>
            {projectList.length > 0 && 
                projectList.map((p, idx) => <ProjectItem key={idx} project={{...p.data, id: p.id as string} as ProjectType} />)
            }
        </section>
    )
}