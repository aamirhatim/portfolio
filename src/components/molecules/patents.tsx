import { Patent } from '../../data/datatypes'
import { patents } from '../../data/patentData'
import ExpPatentItem from '../atoms/ExpPatentItem/ExpPatentItem'

function createPatentItem(patent:Patent) {
        const key = 'patent-' + patent.id
        return <ExpPatentItem key={key} item={patent} />
    }

export default function Patents() {
    return (
        <section className='box-border p-5'>
            <div className='text-4xl font-bold mb-6'>Patents</div>
            <div className='flex flex-wrap gap-6 justify-center'>
                {patents.map( (p) => createPatentItem(p) )}
            </div>
        </section>
    )
}