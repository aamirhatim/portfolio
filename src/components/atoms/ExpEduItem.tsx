import { motion } from 'motion/react'
import { EducationType } from '../../data/datatypes'

export default function ExpEduItem(props: {item:EducationType}){
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
        amount: .5
    }
    
    return (
        <motion.div
            className='flex flex-col gap-2'
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
        >
            <div className='text-lg text-(--txt-subtitle-color)'>{props.item.school} - {props.item.end}</div>
            <div className='text-2xl title'>{props.item.degree.long}: <span className='text-(--txt-subtitle-color)'>{props.item.field}</span></div>
        </motion.div>
    )
}