import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesDown } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion, Transition } from "motion/react";
import { useCallback, useEffect, useState } from "react";

export default function ScrollHint(props: {classname?:string}) {
    // Init state
    const [vis, setVis] = useState<boolean>(true);

    // Animation config
    const bounceTransition:Transition = {
        delay: 2,
        duration: .6,
        times: [0, .6, 1],
        repeat: Infinity,
        repeatType: "loop",
        repeatDelay: 1.5,
        ease: ["easeOut", [0.17, 2.76, 0.52, 0.99]]
    };
    const animate = {
        y: [20, 0, 20],
        opacity: 1,
        transition: bounceTransition
    };
    const initial = {
        opacity: 0,
        transition: { duration: 1.5 }
    };
    const exit = {
        opacity: 0,
        transition: { duration: .25 }
    };

    // Scroll handler
    const handleScroll = useCallback(() => {
        const scrollVal = window.scrollY;

        if (scrollVal >= 50) {
            setVis(false);
        } else {
            setVis(true);
        }
    }, []);

    // Set up scroll listener
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        // Cleaup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        }
    }, [handleScroll]);

    return (
        <AnimatePresence>
            {vis &&
                <motion.div
                    className={`${props.classname}`}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                >
                    <FontAwesomeIcon icon={faAnglesDown} size='lg' />
                </motion.div>
            }
        </AnimatePresence>
    )
}