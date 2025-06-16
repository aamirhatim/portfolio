import { Job } from "../../data/datatypes"
import { jobs } from "../../data/jobs"
import ExpJobItem from "../atoms/ExpJobItem/ExpJobItem"

function createJobItem(job:Job) {
    const key = 'job-' + job.id
    return <ExpJobItem key={key} job={job} />
}

export default function PrevWork() {
    return (
        <section className='box-border p-5'>
            <div className='text-4xl font-bold mb-6'>Previous Roles</div>
            <div className='flex flex-col gap-6'>
                {jobs.slice(1).map( (j) => createJobItem(j) )}
            </div>
        </section>
    )
}