import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";
import { ChevronsRight } from "lucide-react";

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
    
    return (
        <div
            onClick={handleNav}
            className={`${props.className || ''} cursor-pointer w-fit !no-underline flex items-center gap-2 text-(--txt-subtitle-color) hover:text-(--txt-highlight-color) transition-all duration-150 hover:gap-4 hover:ml-4 active:scale-95`}
        >
            <div>{props.text}</div>
            <ChevronsRight size={16} />
        </div>
    )
}