import { useParams } from "react-router"
import ProjectArticle from "../organisms/ProjectArticle";

export default function ProjectViewer() {
    // Get params
    const params = useParams();
    const projectId = params.projectId!;

    return (
        <div>
            <div>Project viewier</div>
            <ProjectArticle projectId={projectId} />
        </div>
    )
}