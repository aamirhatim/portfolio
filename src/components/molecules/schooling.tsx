import { educationList } from '../../data/education'
import { Education } from '../../data/datatypes'
import ExpEduItem from '../atoms/ExpEduItem/ExpEduItem'

function createEduItem(edu:Education) {
        const key = 'edu-' + edu.id
        return <ExpEduItem key={key} item={edu} />
    }

export default function Schooling() {
    return (
        <div className='box-border p-5'>
            <div className='text-4xl font-bold mb-6'>Education</div>
            <div id='exp-edu'>
                {educationList.map( (edu) => createEduItem(edu) )}
            </div>
        </div>
    )
}