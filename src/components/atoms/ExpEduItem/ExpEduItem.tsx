import { Education } from '../../../data/datatypes'
import './ExpEduItem.style.scss'

function ExpEduItem(props: {item:Education}){
    return (
        <div className='exp-edu-item'>
            <div className='exp-edu-degree'>{props.item.degree}: <span className='edu-major'>{props.item.major}</span></div>
            <div className='exp-edu-school'>{props.item.school} - {props.item.yearEnd}</div>
        </div>
    )
}

export default ExpEduItem