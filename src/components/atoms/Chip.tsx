import { motion } from "motion/react";
import { cssVarToHex } from "../../lib/colorVars";

export interface ChipProps {
    text: string,
    size?: string,
}

export default function Chip(props:ChipProps) {
    const commonClasses = `box-border border border-(--txt-subtitle-color) text-(--txt-subtitle-color) rounded-md`;
    
    const chipClasses = props.size === "lg"
        ? `${commonClasses} px-4 py-1 text-xl`
        : `${commonClasses} px-2 text-xs`;

    // Animation config
    const initial = {
        backgroundColor: cssVarToHex('--bg-color')
    }
    const hover = {
        scale: 1.05,
        backgroundColor: cssVarToHex('--bg-secondary-color')
    }

    return (
        <motion.div
            className={chipClasses}
            initial={initial}
            whileHover={hover}
        >
            {props.text}
        </motion.div>
    )
}