import * as P from "../../../data/projectData"
import "./Projects.style.scss"
import ProjectTile from "../../molecules/ProjectTile/ProjectTile"

const projects = [
    P.omniProject,
    P.argoProject,
    P.dayZeroProject,
    P.inspectorBaxterProject,
    P.neuralNetProject,
    P.pathPlanProject,
    P.portfolioProject,
    P.motorControllerProject,
    P.techtilesProject
]

function Projects() {
    return (
        <section id="projects">
            <h1>Selected work.</h1>
            <div id="proj-grid">
                {projects.map( p => {
                    return(<ProjectTile proj={p} />)
                })}
            </div>
        </section>
    )
}

export default Projects