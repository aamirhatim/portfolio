import { currentWorkDesc, jobs } from "../../data/jobs"
import ChipGroup from "./ChipGroup"

export default function CurrentWork() {
    return (
        <section className='box-border border border-[var(--border-color)] rounded-xl p-10'>
            <div className='text-lg text-[var(--txt-subtitle-color)]'>{jobs[0].start} - Present</div>
            <div className='text-3xl font-bold text-[var(--txt-title-color)]'>{jobs[0].title} <span className='text-[var(--txt-accent-color)]'>@{jobs[0].company}</span></div>
            <div className='box-border mt-4 text-xl'>{currentWorkDesc}</div>
            {jobs[0].skills &&
            <div className='mt-8'>
                <ChipGroup list={jobs[0].skills} />
            </div>
            }
        </section>
    )
}