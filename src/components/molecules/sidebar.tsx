import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAppContext } from "../../context/appContext"
import { useEffect, useState } from "react"
import { ANIMATION_DURATION_MS } from "../pages/AppLayout"

export default function Sidebar(props: {title:string}) {
    // Get context
    const { navSelect, setNavSelect } = useAppContext();
    const { title } = props;

    // Init state
    const [showSidebar, setShowSidebar] = useState<boolean>(false);
    const [displayTitle, setDisplayTitle] = useState<string>(props.title);
    const [isFading, setIsFading] = useState<boolean>(true);

    // Define animation classes
    const slideInClasses = `transform transition-all duration-[${ANIMATION_DURATION_MS}ms] ease-in-out ${showSidebar ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full'}`
    const fadeClasses = `transition-opacity duration-[${ANIMATION_DURATION_MS}ms] ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`

    // Hide sidebar if on home page
    useEffect(() => {
        if (navSelect === "home") {
            setShowSidebar(false)
        } else {
            setShowSidebar(true)
        }
    }, [navSelect]);

    // Fade animation for sidebar title
    useEffect(() => {
        if (displayTitle === "home") {
            // No fade in if going from home to another page
            setDisplayTitle(title);
            setIsFading(false);
        } else if (title !== displayTitle) {
            // Fade if switching between non-home pages
            setIsFading(true);
            const timer = setTimeout(() => {
                setDisplayTitle(title);
                setIsFading(false);
            }, ANIMATION_DURATION_MS);

            return () => clearTimeout(timer);
        } else {
            // No animation if title is the same
            setDisplayTitle(title);
            setIsFading(false);
        }
    }, [title]);
    
    return (
        <div id="sidebar" className={`float-left box-border px-12 pt-40 pb-20 flex flex-col justify-between items-start h-full w-[300px] grow-0 shrink-0 ${slideInClasses}`}>
            <div className={`text-5xl font-bold text-violet-900 ${fadeClasses}`}>{displayTitle}.</div>
            <div onClick={() => setNavSelect("home")} className={`hover:scale-130 hover:text-[var(--txt-title-color)] transition-all duration-[${ANIMATION_DURATION_MS}ms]`}><FontAwesomeIcon icon={faArrowAltCircleLeft} size="2xl" /></div>
        </div>
    )
}