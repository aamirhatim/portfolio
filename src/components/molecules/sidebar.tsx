import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router"
import { useAppContext } from "../../context/appContext"
import { useEffect, useState } from "react"

export default function Sidebar(props: {title:string}) {
    // Get context
    const appContext = useAppContext()

    // Init state
    const [showSidebar, setShowSidebar] = useState<boolean>(false)

    const handleClose = () => {
        appContext.setNavSelect("home")
    }

    // Hide sidebar if on home page
    useEffect( () => {
        if (appContext.navSelect === "home") {
            setShowSidebar(false)
        } else {
            setShowSidebar(true)
        }
    }, [appContext.navSelect])
    
    return (
        <>
        {showSidebar &&
            <div id="sidebar" className="float-left box-border px-12 pt-40 pb-20 flex flex-col justify-between items-start h-full w-[300px] grow-0 shrink-0">
                <div className="text-5xl font-bold text-violet-900">{props.title}.</div>
                <Link to="/" onClick={handleClose} className="hover:scale-130 transition duration-100"><FontAwesomeIcon icon={faArrowAltCircleLeft} size="2xl" /></Link>
            </div>
        }
        </>
    )
}