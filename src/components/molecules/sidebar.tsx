import { useAppContext } from "../../context/appContext";
import { useEffect, useState } from "react";
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
        width: "100%",
        paddingLeft: 0,
        paddingRight: 0,
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
    const { navSelect } = useAppContext();
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
            className="box-border pt-40"
            variants={sidebarVariants}
            initial={sidebarState}
            animate={sidebarState}
        >
            {!(navToHome || navToArticle) &&
                <AnimatePresence mode="wait">
                    <motion.div
                        key={title}
                        variants={titleVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-5xl font-bold text-(--bg-secondary-color) cursive"
                    >
                        {title}.
                    </motion.div>
                </AnimatePresence>
            }
        </motion.div>
    )
}