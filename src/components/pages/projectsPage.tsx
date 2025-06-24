import projects from "../../data/projectData"
import ProjectTile from "../atoms/ProjectTile/ProjectTile"

export default function ProjectsPage() {
    return (
        <div className="flex flex-col gap-30">
            <section className="box-border flex flex-col gap-8">
                {projects.map( (p, idx) => (
                    <ProjectTile key={idx} project={p} />
                ))}
            </section>
        </div>
    )
}