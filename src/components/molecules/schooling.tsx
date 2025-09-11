import { educationList } from '../../data/education'
import ExpEduItem from '../atoms/ExpEduItem'

export default function Schooling() {
    return (
        <section>
            <div className='text-4xl font-bold mb-6'>education.</div>
            <div className='flex flex-col gap-6'>
                {educationList.map( (edu, idx) => <ExpEduItem key={idx} item={edu} /> )}
            </div>
        </section>
    )
}