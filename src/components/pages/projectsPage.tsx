import { useCallback, useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import ProjectItem from "../molecules/ProjectItem"
import { ProjectType } from "../../data/datatypes";
import useIsMobile from "../../lib/hooks/useIsMobile";
import { orderBy } from "firebase/firestore";
import AnimateInView from "../atoms/AnimateInView";

export default function ProjectsPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();

    // Init state
    const [projectList, setProjectList] = useState<Record<string, ProjectType[]>>({});

    // Fetch projects
    const getProjects = useCallback(async () => {
        const filter = orderBy("publishDate", "desc");
        const projectList = await getDocumentsFromCollection(firebaseAppContext, "projects", [filter]);
        if (!projectList) {
            setProjectList({});
            return;
        }

        // Categorize by year
        const projectsByYear = projectList.reduce((acc: Record<string, ProjectType[]>, p) => {
            const project = { ...p.data, id: p.id } as ProjectType;
            const year = project.publishDate.split("-")[0];
            if (!acc[year]) acc[year] = [];
            acc[year].push(project);
            return acc;
        }, {});

        setProjectList(projectsByYear);
    }, [firebaseAppContext, setProjectList]);

    const createProjectSection = useCallback((projects: ProjectType[], year: string) => {
        return (
            <section key={year} className={`flex flex-col ${isMobile ? 'gap-6 w-full' : 'gap-18'}`}>
                <AnimateInView><h2 className='!m-0'>{year}</h2></AnimateInView>
                {projects.map((p, idx) => <AnimateInView key={idx}><ProjectItem project={p} /></AnimateInView>)}
            </section>
        )
    }, [isMobile]);

    // Get list of projects
    useEffect(() => {
        getProjects();
    }, [getProjects]);

    return (
        <div className={`box-border flex flex-col px-4 ${isMobile ? 'gap-10 w-full' : 'gap-20 max-w-[800px] mx-auto'}`}>
            {Object.keys(projectList).length > 0 &&
                Object.entries(projectList).reverse().map(([year, projects]) => createProjectSection(projects, year))
            }
        </div>
    )
}