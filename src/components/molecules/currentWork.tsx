import { currentWorkDesc, jobs } from "../../data/jobs";

export default function CurrentWork() {
    return (
        <section className='box-border border rounded-xl p-10'>
            <div className='text-lg'>{jobs[0].start} - Present</div>
            <div className='text-3xl font-bold'>{jobs[0].title} <span>@{jobs[0].company}</span></div>
            <div className='box-border mt-4 text-xl'>{currentWorkDesc}</div>
        </section>
    )
}