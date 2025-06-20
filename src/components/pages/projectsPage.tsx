import projects from "../../data/projectData"
import ProjectTile from "../atoms/ProjectTile/ProjectTile"

export default function ProjectsPage() {
    const numHighlights = 3

    return (
        <div className="flex flex-col gap-30">
            {/* Highlights */}
            <section className="box-border flex flex-wrap justify-center gap-5">
                {projects.slice(0, numHighlights).map( (p, idx) => (
                    <ProjectTile key={idx} project={p} color={"#000000"} highlight={true} />
                ))}
            </section>

            <div className="text-3xl text-center">See more of my work on GitHub</div>

            {/* Other projects */}
            <section className="box-border flex flex-wrap justify-center gap-5">
                {projects.slice(numHighlights + 1).map( (p, idx) => (
                    <ProjectTile key={idx} project={p} color={"#000000"} />
                ))}
            </section>
        </div>
    )
}