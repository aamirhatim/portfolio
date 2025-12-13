import { motion } from "motion/react";
import usePreferredColorScheme from "../../lib/hooks/usePreferredColorScheme";
import { useMemo } from "react";

export interface ChipProps {
    text: string,
    size?: string,
}

export default function Chip(props:ChipProps) {
    // Get context
    const { scheme, colorToHex } = usePreferredColorScheme();

    // Define chip style classes
    const commonClasses = `box-border border text-(--txt-subtitle-color) rounded-md`;
    const chipClasses = props.size === "lg"
        ? `${commonClasses} px-4 py-1 text-xl`
        : `${commonClasses} px-2 text-xs`;

    // Animation config
    const motionConfig = useMemo(() => {
        // Define variants
        const initial = {
            backgroundColor: colorToHex('--bg-color')
        };
        const hover = {
            scale: 1.05,
            backgroundColor: colorToHex('--bg-secondary-color')
        };

        return {initial, hover};
    }, [scheme]);

    return (
        <motion.div
            key={scheme}
            className={chipClasses}
            initial={motionConfig.initial}
            whileHover={motionConfig.hover}
        >
            {props.text}
        </motion.div>
    )
}