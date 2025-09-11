import projects from "../../data/projectData"
import ProjectHighlight from "../molecules/projectHighlight"
import introTxt from '../../data/intro'
import ArrowBtn from '../atoms/ArrowBtn'

export default function HomePage() {
    return (
        <div className="box-border pl-[12%] flex flex-col w-full gap-40">
            <h1 className="flex w-[55%] font-bold">{introTxt}</h1>

            <section>
                <div className="text-4xl font-bold mb-10">Featured work</div>
                <div className="flex flex-wrap gap-5">
                    {projects.slice(0,4).map( (p, idx) => (<ProjectHighlight key={idx} project={p}/>))}
                </div>
                
                <ArrowBtn text="See more" link="projects" />
            </section>
        </div>
    )
}