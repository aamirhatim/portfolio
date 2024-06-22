import "./ProjectTile.style.scss"
import { ProjectType } from "../../../data/datatypes"
import ProjectLinks from "../../molecules/ProjectLinks/ProjectLinks"
import SkillChips from "../../molecules/SkillChips/SkillChips"

function ProjectTile( {proj}:{proj:ProjectType} ) {
    return (
        <div className="project-tile">
            <h2>{proj.title}</h2>
            <h3>{proj.subtitle}</h3>
            <p>{proj.description}</p>
            <SkillChips chips={proj.skills} />
            <ProjectLinks props={{codeUrl: proj.code, videoUrl: proj.video}} />
        </div>
    )
}

export default ProjectTile