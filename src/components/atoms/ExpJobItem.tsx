import { JobType } from '../../data/datatypes'
import ChipGroup from '../molecules/ChipGroup'

export default function ExpJobItem(props: {job: JobType}) {
    return (
        <div>
            <div className='text-md text-[var(--txt-subtitle-color)]'>{props.job.start} - {props.job.end}</div>
            <div className='text-xl font-bold text-[var(--txt-title-color)]'>{props.job.title} <span className='text-[var(--txt-accent-color)]'>@{props.job.company}</span></div>
            <div className='text-lg'>{props.job.description}</div>
            {props.job.skills &&
                <div className='mt-3'>
                    <ChipGroup list={props.job.skills} />
                </div>
            }
        </div> 
    )
}