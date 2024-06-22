import "./ProjectLinks.style.scss"
import ProjectLink from "../../atoms/ProjectLink/ProjectLink"

type ProjectLinksProps = {
    codeUrl?: string,
    videoUrl?: string
}

function ProjectLinks( {props}:{props:ProjectLinksProps} ) {
    return (
        <div className="proj-links">
            {props.codeUrl && <ProjectLink title="Code" url={props.codeUrl} />}
            {props.videoUrl && <ProjectLink title="Video" url={props.videoUrl} />}
        </div>
    )
}

export default ProjectLinks