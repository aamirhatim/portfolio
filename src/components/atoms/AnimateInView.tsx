import { motion } from "motion/react";

// Animation config
const initial = {
    opacity: 0,
    y: 50
}
const whileInView = {
    opacity: 1,
    y: 0,
    transition: { duration: .2 }
}
const viewport = {
    once: true,
    amount: .25
}

export default function AnimateInView({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
        >
            {children}
        </motion.div>
    )
}