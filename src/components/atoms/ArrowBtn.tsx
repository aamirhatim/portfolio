import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { motion } from "motion/react";
import { cssVarToHex } from "../../lib/colorVars";

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

    // Define animation config
    const initial = {
        color: cssVarToHex('--txt-subtitle-color')
    }
    const hover = {
        gap: '16px',
        marginLeft: '16px',
        color: cssVarToHex('--txt-highlight-color'),
        transition: { duration: .15 }
    }
    const tap = {
        scale: 0.95,
        transition: { duration: .1 }
    }
    
    return (
        <motion.div
            onClick={handleNav}
            className={`${props.className} cursor-pointer w-fit !no-underline flex items-center gap-2`}
            initial={initial}
            whileHover={hover}
            whileTap={tap}
        >
            <div>{props.text}</div>
            <FontAwesomeIcon icon={faAnglesRight} size='sm' />
        </motion.div>
    )
}