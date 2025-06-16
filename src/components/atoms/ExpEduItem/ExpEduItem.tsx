import { Education } from '../../../data/datatypes'

export default function ExpEduItem(props: {item:Education}){
    return (
        <div>
            <div className='text-2xl font-bold'>{props.item.degree}: <span>{props.item.major}</span></div>
            <div className='text-xl'>{props.item.school} - {props.item.yearEnd}</div>
        </div>
    )
}