import { motion } from 'motion/react'
import { JobType } from '../../data/datatypes'
import ChipGroup from '../molecules/ChipGroup'

export default function ExpJobItem(props: {job: JobType}) {
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
            <div className='text-sm text-(--txt-subtitle-color)'>{props.job.start} - {props.job.end}</div>
            <div className='text-2xl title'>{props.job.title} <span className='text-(--txt-subtitle-color)'>@{props.job.company}</span></div>
            <div className='text-lg'>{props.job.description}</div>
            {props.job.skills &&
                <div className='mt-3'>
                    <ChipGroup list={props.job.skills} />
                </div>
            }
        </motion.div> 
    )
}