import { Link } from "react-router";
import { useAppContext } from "../../context/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { ANIMATION_DURATION_MS } from "../../data/constants";

export default function ArrowBtn(props:{text:string, link:string, className?:string}) {
    const appContext = useAppContext();

    const hoverClasses = `hover:gap-4 hover:ml-2 transition-all duration-[${ANIMATION_DURATION_MS}ms] ease-in-out`;
    
    return (
        <Link to="/projects" onClick={() => appContext.setNavSelect(props.link)} className={`${props.className} w-fit !no-underline flex items-center gap-2 ${hoverClasses}`}>
            <div>{props.text}</div>
            <FontAwesomeIcon icon={faAnglesRight} size='sm' />
        </Link>
    )
}