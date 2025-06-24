import { Job } from '../../../data/datatypes'

export default function ExpJobItem(props: {job: Job}) {
    return (
        <div>
            <div className='text-md'>{props.job.start} - {props.job.end}</div>
            <div className='text-xl font-bold'>{props.job.title} <span>@{props.job.company}</span></div>
            <div className='text-lg'>{props.job.description}</div>
            {props.job.skills &&
                <div className='flex flex-wrap gap-1 mt-2'>
                    {props.job.skills.map( (s) => (<div className='box-border px-2 border rounded-full text-xs'>{s}</div>))}
                </div>
            }
        </div> 
    )
}