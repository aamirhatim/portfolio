import "./ProjectTile.style.scss"
import { ProjectType } from "../../../data/datatypes"
import ProjectLinks from "../../molecules/ProjectLinks/ProjectLinks"
import SkillChips from "../../molecules/SkillChips/SkillChips"

function ProjectTile( {proj}:{proj:ProjectType} ) {
    return (
        <div className="project-tile">
            <h3><b>{proj.title}</b></h3>
            <h4>{proj.subtitle}</h4>
            <p>{proj.description}</p>
            <SkillChips chips={proj.skills} />
            <ProjectLinks props={{codeUrl: proj.code, videoUrl: proj.video}} />
        </div>
    )
}

export default ProjectTile