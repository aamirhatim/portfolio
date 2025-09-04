import { educationList } from '../../data/education'
import { EducationType } from '../../data/datatypes'
import ExpEduItem from '../atoms/ExpEduItem/ExpEduItem'

function createEduItem(edu:EducationType) {
        const key = 'edu-' + edu.id
        return <ExpEduItem key={key} item={edu} />
    }

export default function Schooling() {
    return (
        <section>
            <div className='text-4xl font-bold mb-6'>education.</div>
            <div className='flex flex-col gap-6'>
                {educationList.map( (edu) => createEduItem(edu) )}
            </div>
        </section>
    )
}