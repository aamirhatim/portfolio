import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { ANIMATION_DURATION_MS } from "../../data/constants";

export default function ArrowBtn(props:{text:string, link:string, className?:string, newTab?:boolean}) {
    const navigate = useNavigate();
    const { setNavSelect } = useAppContext();

    // Nav handler
    const handleNav = () => {
        if (props.newTab) {
            window.open(props.link, '_blank');
        } else {
            setNavSelect(props.link);
            navigate(props.link);
        }
    };

    const hoverClasses = `hover:gap-4 hover:ml-2 transition-all duration-[${ANIMATION_DURATION_MS}ms] ease-in-out`;
    
    return (
        <div onClick={handleNav} className={`${props.className} cursor-pointer w-fit !no-underline flex items-center gap-2 ${hoverClasses}`}>
            <div>{props.text}</div>
            <FontAwesomeIcon icon={faAnglesRight} size='sm' />
        </div>
    )
}