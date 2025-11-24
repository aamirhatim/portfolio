import { useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import ProjectItem from "../molecules/ProjectItem"
import { FirestoreDocType, ProjectType } from "../../data/datatypes";

export default function ProjectsPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

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
        <div className={`flex flex-col gap-30`}>
            <section className="box-border flex flex-col gap-12">
                {projectList.map( (p, idx) => <ProjectItem key={idx} project={{...p.data, id: p.id as string} as ProjectType} /> )}
            </section>
        </div>
    )
}