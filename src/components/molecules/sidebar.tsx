import { faArrowAltCircleLeft } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useAppContext } from "../../context/appContext"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion";
import { ANIMATION_DURATION_MS } from "../../data/constants";

const duration = ANIMATION_DURATION_MS / 1000;

const sidebarVariants = {
    hidden: {
        width: 0,
        paddingLeft: 0,
        paddingRight: 0,
        opacity: 0,
        transition: {
            duration: duration,
            delay: duration / 2,
        }
    },
    visible: {
        width: 300,
        paddingLeft: "calc(var(--spacing) * 12)",
        paddingRight: "calc(var(--spacing) * 12)",
        opacity: 1,
        transition: {
            duration: duration,
            delay: duration / 2,
        }
    }
};

const titleVariants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration,
            delay: duration / 2,
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: duration / 2,
        }
    }
};

export default function Sidebar(props: {title:string}) {
    // Get context
    const { navSelect, setNavSelect } = useAppContext();
    const { title } = props;

    // Init state
    const [navToHome, setNavToHome] = useState<boolean>(navSelect === "home");
    const [navToArticle, setNavToArticle] = useState<boolean>(navSelect !== "projects" && navSelect.startsWith("projects/"));

    // Hide sidebar if on home page or article
    const sidebarState = navToHome || navToArticle ? "hidden" : "visible";
    useEffect(() => {
        setNavToHome(navSelect === "home");
        setNavToArticle(navSelect !== "projects" && navSelect.startsWith("projects/"));
    }, [navSelect]);
    
    return (
        <motion.div
            id="sidebar"
            className="float-left box-border pt-40 pb-20 flex flex-col justify-between items-start h-full grow-0 shrink-0"
            variants={sidebarVariants}
            initial={sidebarState}
            animate={sidebarState}
        >
            {!(navToHome || navToArticle) &&
                <> 
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={title}
                            variants={titleVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="text-5xl font-bold text-violet-900"
                        >
                            {title}.
                        </motion.div>
                    </AnimatePresence>

                    <div
                        onClick={() => setNavSelect("home")}
                        className={`hover:scale-130 hover:text-[var(--txt-title-color)] transition-all duration-[${ANIMATION_DURATION_MS}ms]`}
                    >
                        <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2xl" />
                    </div>
                </>
            }
        </motion.div>
    )
}