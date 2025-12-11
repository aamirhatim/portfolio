import { useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import ProjectItem from "../molecules/ProjectItem"
import { FirestoreDocType, ProjectType } from "../../data/datatypes";
import useIsMobile from "../hooks";

export default function ProjectsPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();

    // Init state
    const [projectList, setProjectList] = useState<FirestoreDocType[]>([]);

    // Get list of projects
    useEffect( () => {
        const getProjects = async () => {
            const projectList = await getDocumentsFromCollection(firebaseAppContext, "projects");
            if (!projectList) {
                setProjectList([]);
                return;
            }
            setProjectList(projectList);
        };
        getProjects();
    }, []);

    return (
        <section className={`box-border flex flex-col px-4 ${isMobile ? 'gap-6 w-full' : 'gap-18 max-w-[800px] mx-auto'}`}>
            {projectList.map((p, idx) => <ProjectItem key={idx} project={{...p.data, id: p.id as string} as ProjectType} />)}
        </section>
    )
}