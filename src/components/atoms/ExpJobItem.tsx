import { JobType } from '../../data/datatypes'
import ChipGroup from '../molecules/ChipGroup'

export default function ExpJobItem(props: { job: JobType, showDetail?: boolean }) {
    return (
        <div className='flex flex-col gap-2'>
            <div className='text-sm text-(--txt-subtitle-color)'>{props.job.start} - {props.job.end}</div>
            <div className='text-2xl title'>{props.job.title} <span className='text-(--txt-subtitle-color)'>@{props.job.company}</span></div>
            <div className='text-lg'>{props.showDetail ? props.job.detail : props.job.description}</div>
            {props.job.skills &&
                <div className='mt-3'>
                    <ChipGroup list={props.job.skills} />
                </div>
            }
        </div>
    )
}