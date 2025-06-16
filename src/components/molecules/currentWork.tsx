import { currentWorkDesc, jobs } from "../../data/jobs";

export default function CurrentWork() {
    return (
        <section className='box-border border rounded-xl p-5'>
            <div className='text-xl'>{jobs[0].start} - Present</div>
            <div className='text-4xl font-bold'>{jobs[0].title} <span>@{jobs[0].company}</span></div>
            <div className='box-border mt-4 text-2xl'>{currentWorkDesc}</div>
        </section>
    )
}