import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons"
import projects from "../../data/projectData"
import ProjectHighlight from "../molecules/projectHighlight"
import { Link } from 'react-router'
import { useAppContext } from '../../context/appContext'

export default function HomePage() {
    // Get context
    const appContext = useAppContext()

    const handleClick = () => {
        appContext.setNavSelect("projects")
    }

    return (
        <div className="box-border pl-[12%] flex flex-col w-full gap-40">
            <section className="flex w-[55%] text-5xl text-violet-400 font-bold">
                I'm a software developer currently working at Verizon
                with a focus in robotics, edge computing, human-machine interfaces and AI enablement. 
                I strive to turn thoughts and ideas into something real.
            </section>

            <section>
                <div className="text-4xl font-bold mb-10">Featured work</div>
                <div className="flex flex-wrap gap-5">
                    {projects.slice(0,4).map( (p, idx) => (<ProjectHighlight key={idx} project={p}/>))}
                </div>
                <Link to="/projects" onClick={handleClick} className="flex items-center gap-2 text-xl mt-5 w-max">
                    <div>See more</div>
                    <FontAwesomeIcon icon={faAnglesRight} size='sm' />
                </Link>
            </section>
        </div>
    )
}