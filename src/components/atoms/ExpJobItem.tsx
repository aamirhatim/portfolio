import { JobType } from '../../../data/datatypes'

export default function ExpJobItem(props: {job: JobType}) {
    return (
        <div>
            <div className='text-md text-violet-400'>{props.job.start} - {props.job.end}</div>
            <div className='text-xl font-bold text-blue-400'>{props.job.title} <span className='text-orange-500'>@{props.job.company}</span></div>
            <div className='text-lg'>{props.job.description}</div>
            {props.job.skills &&
                <div className='flex flex-wrap gap-1 mt-4'>
                    {props.job.skills.map( (s, idx) => (<div key={idx} className='box-border px-2 border border-violet-400 text-violet-400 rounded-full text-xs'>{s}</div>))}
                </div>
            }
        </div> 
    )
}