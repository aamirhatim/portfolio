import { useEffect, useRef, useState } from "react";
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

    // Create refs
    const sectionRef = useRef<HTMLDivElement>(null);

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
        <section ref={sectionRef} className={`box-border pt-40 flex flex-col mx-auto ${isMobile ? 'px-4 gap-6' : 'gap-18 max-w-[1000px]'}`}>
            {projectList.map((p, idx) => <ProjectItem key={idx} project={{...p.data, id: p.id as string} as ProjectType} />)}
        </section>
    )
}