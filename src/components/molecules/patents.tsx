import { PatentType } from '../../data/datatypes'
import { patents } from '../../data/patentData'
import ExpPatentItem from '../atoms/ExpPatentItem/ExpPatentItem'

function createPatentItem(patent:PatentType) {
        const key = 'patent-' + patent.id
        return <ExpPatentItem key={key} item={patent} />
    }

export default function Patents() {
    const granted = patents.filter(p => p.status === "GRANTED")
    const submitted = patents.filter(p => p.status === "SUBMITTED")
    
    return (
        <section>
            <div className='text-4xl font-bold mb-6'>patents.</div>
            <div className='flex flex-col gap-6'>
                {granted.map( (p) => createPatentItem(p) )}
                {submitted.map( (p) => createPatentItem(p) )}
            </div>
        </section>
    )
}