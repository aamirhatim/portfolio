import { Link } from "react-router"
import { useAppContext } from "../../context/appContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons"

export default function ArrowBtn(props:{text:string, link:string}) {
    const appContext = useAppContext()
    
    return (
        <Link to="/projects" onClick={() => appContext.setNavSelect(props.link)} className="flex items-center gap-2 text-xl mt-5 w-max">
            <div>{props.text}</div>
            <FontAwesomeIcon icon={faAnglesRight} size='sm' />
        </Link>
    )
}