import projects from "../../data/projectData"
import ProjectHighlight from "../molecules/projectHighlight"

export default function IndexPage() {
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
                <div className="text-xl mt-5">See more</div>
            </section>
        </div>
    )
}