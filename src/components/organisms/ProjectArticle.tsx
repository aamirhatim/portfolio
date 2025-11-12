import { useEffect, useState } from "react"
import { ProjectType } from "../../data/datatypes";
import { getDocumentFromId } from "../../lib/firestoreLib";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import ChipGroup from "../molecules/ChipGroup";

export default function ProjectArticle(props: {projectId:string}) {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [project, setProject] = useState<ProjectType>();

    // Get project info
    useEffect(() => {
        const getProject = async () => {
            const projectDoc = await getDocumentFromId(firebaseAppContext, "projects", props.projectId);
            if (!projectDoc) return;

            const project = {
                id: projectDoc.id,
                ...projectDoc.data,
            } as ProjectType;
            setProject(project);
        };

        getProject();
    }, [props.projectId]);

    return (
        <div className="box-border flex flex-col gap-12">
            <div className="font-bold text-6xl text-(--txt-feature-color)">{project?.title}</div>
            {project?.skills && <ChipGroup list={project.skills} />}
        </div>
    )
}