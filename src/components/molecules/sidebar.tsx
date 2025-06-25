import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "@tanstack/react-router"
import { Route } from "../../routes/__root"

export default function Sidebar(props: {title:string}) {
    // Get context
    const routeContext = Route.useRouteContext()

    const handleClose = () => {
        routeContext.setNav('')
    }
    
    return (
        <div className="box-border pt-40 pl-[12%] py-20 flex flex-col justify-between items-start h-full min-w-[25%]">
            <div className="text-5xl font-bold">{props.title}.</div>
            <Link to="/" onClick={handleClose} className="hover:scale-130 transition duration-100"><FontAwesomeIcon icon={faArrowAltCircleLeft} size="2xl" /></Link>
        </div>
    )
}