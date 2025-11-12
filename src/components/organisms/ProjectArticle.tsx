import { useEffect, useState } from "react"
import { ProjectArticleType, ProjectType } from "../../data/datatypes";
import { getDocumentFromId } from "../../lib/firestoreLib";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import ChipGroup from "../molecules/ChipGroup";

export default function ProjectArticle(props: {projectId:string}) {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [project, setProject] = useState<ProjectType>();
    const [article, setArticle] = useState<ProjectArticleType>();

    // Get project info
    useEffect(() => {
        const getProject = async () => {
            const projectDoc = await getDocumentFromId(firebaseAppContext, "projects", props.projectId);
            if (!projectDoc) return;

            const projectData = {
                id: projectDoc.id,
                ...projectDoc.data,
            } as ProjectType;
            setProject(projectData);
        };

        getProject();
    }, [props.projectId]);

    // Get project article
    useEffect(() => {
        const getProjectArticle = async () => {
            const doc = await getDocumentFromId(firebaseAppContext, "project_articles", props.projectId);
            if (!doc) return;

            const articleData = {
                ...doc.data
            } as ProjectArticleType;
            setArticle(articleData);
        };

        getProjectArticle();
    }, [props.projectId]);

    return (
        <div className="box-border flex flex-col gap-12">
            <div className="font-bold text-6xl text-(--txt-feature-color)">{project?.title}</div>

            {article &&
                <>
                <div className="text-md text-(--txt-feature-color)">{article.publishDate}</div>
                </>
            }

            {project?.skills &&
                <div>
                    <div className="font-bold text-lg text-(--txt-feature-color) mb-3">Keywords</div>
                    <ChipGroup list={project.skills} />
                </div>
            }
        </div>
    )
}