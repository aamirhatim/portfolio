import { currentWorkDesc, jobs } from "../../data/jobs";

export default function CurrentWork() {
    return (
        <section className='box-border border border-violet-700 rounded-xl p-10'>
            <div className='text-lg text-violet-400'>{jobs[0].start} - Present</div>
            <div className='text-3xl font-bold text-blue-400'>{jobs[0].title} <span className='text-red-500'>@{jobs[0].company}</span></div>
            <div className='box-border mt-4 text-xl'>{currentWorkDesc}</div>
            {jobs[0].skills &&
                <div className='flex flex-wrap gap-1 mt-8'>
                    {jobs[0].skills.map( (s, idx) => (<div key={idx} className='box-border px-2 border border-violet-400 text-violet-400 rounded-full text-xs'>{s}</div>))}
                </div>
            }
        </section>
    )
}