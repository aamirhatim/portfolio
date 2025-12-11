import { motion } from 'motion/react'
import { PatentType } from '../../data/datatypes'

export default function ExpPatentItem(props: {item: PatentType}) {
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
            className='box-border flex flex-col justify-start gap-2'
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
        >
            <div className='flex gap-3 items-center'>
                <div className='box-border border rounded-sm title text-sm px-2 w-min'>{props.item.status.toUpperCase()}</div>
                {props.item.status === "granted" && 
                <a href={props.item.url} target='_blank'>
                    <div className='text-sm underline'>US Patent No. {props.item.number}</div>
                </a>
                }
            </div>
            <div className='text-2xl title'>{props.item.title}</div>
            <div className='text-lg'>{props.item.description}</div>
        </motion.div> 
    )
}