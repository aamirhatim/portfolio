import { Patent } from '../../../data/datatypes'
import './ExpPatentItem.style.scss'

function ExpPatentItem(props: {item: Patent}) {
    return (
        <div className='exp-patent-item'>
            <div className='patent-title'>
                <div>{props.item.year} - {props.item.title}</div>
                <div className='patent-status'>{props.item.status}</div>
            </div>
            <div className='patent-description'>{props.item.description}</div>
        </div> 
    )
}

export default ExpPatentItem