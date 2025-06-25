import { Patent } from '../../data/datatypes'
import { patents } from '../../data/patentData'
import ExpPatentItem from '../atoms/ExpPatentItem/ExpPatentItem'

function createPatentItem(patent:Patent) {
        const key = 'patent-' + patent.id
        return <ExpPatentItem key={key} item={patent} />
    }

export default function Patents() {
    return (
        <section>
            <div className='text-4xl font-bold mb-6'>patents.</div>
            <div className='flex flex-col gap-6'>
                {patents.map( (p) => createPatentItem(p) )}
            </div>
        </section>
    )
}