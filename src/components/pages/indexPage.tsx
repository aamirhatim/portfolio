import { Link } from "@tanstack/react-router"
import projects from "../../data/projectData"
import ProjectHighlight from "../molecules/projectHighlight"
import { Route } from "../../routes/__root"

export default function IndexPage() {
    // Get context
    const routeContext = Route.useRouteContext()

    const handleClick = () => {
        routeContext.setNav('projects')
    }

    return (
        <div className="box-border pl-[12%] flex flex-col w-full gap-40">
            <section className="flex w-[55%] text-5xl font-bold">
                I'm a software developer currently working at Verizon
                with a focus in robotics, edge computing, human-machine interfaces and AI enablement. 
                I strive to turn thoughts and ideas into something real.
            </section>

            <section>
                <div className="text-4xl font-bold mb-10">Featured work</div>
                <div className="flex flex-wrap gap-5">
                    {projects.slice(0,4).map( (p, idx) => (<ProjectHighlight key={idx} project={p}/>))}
                </div>
                <Link to='/projects' onClick={handleClick}><div className="text-xl mt-5">See more</div></Link>
            </section>
        </div>
    )
}