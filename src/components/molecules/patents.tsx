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
            <div className='text-4xl font-bold'>Patents</div>
            <div id='exp-patent-box'>
                {patents.map( (p) => createPatentItem(p) )}
            </div>
        </section>
    )
}