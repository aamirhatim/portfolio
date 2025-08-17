import { Education } from '../../../data/datatypes'

export default function ExpEduItem(props: {item:Education}){
    return (
        <div>
            <div className='text-lg text-violet-400'>{props.item.school} - {props.item.yearEnd}</div>
            <div className='text-xl font-bold text-blue-400'>{props.item.degree}: <span className='text-red-500'>{props.item.major}</span></div>
        </div>
    )
}