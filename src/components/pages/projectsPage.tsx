import { useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import ProjectItem from "../molecules/ProjectItem"
import { FirestoreDocType, ProjectType } from "../../data/datatypes";
import { Outlet, useLocation } from "react-router";

export default function ProjectsPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const location = useLocation();
    const isIndexRoute = location.pathname === '/projects' || location.pathname === '/projects/';

    // Init state
    const [projectList, setProjectList] = useState<FirestoreDocType[]>([]);

    // Get list of projects
    useEffect( () => {
        const getProjects = async () => {
            const projectList = await getDocumentsFromCollection(firebaseAppContext, "projects");
            setProjectList(projectList);
        };
        getProjects();
    }, []);

    const indexLayout = (
        <div className={`flex flex-col gap-30`}>
            <section className="box-border flex flex-col gap-12">
                {projectList.map( (p, idx) => <ProjectItem key={idx} project={{...p.data, id: p.id as string} as ProjectType} /> )}
            </section>
        </div>
    );

    const articleLayout = (
        <div>
            <Outlet />
        </div>
    );

    return (
        <>
        {isIndexRoute
            ? indexLayout
            : articleLayout
        }
        </>
    )
}