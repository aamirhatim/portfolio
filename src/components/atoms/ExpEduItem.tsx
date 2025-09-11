import { EducationType } from '../../data/datatypes'

export default function ExpEduItem(props: {item:EducationType}){
    return (
        <div>
            <div className='text-lg text-[var(--txt-subtitle-color)]'>{props.item.school} - {props.item.yearEnd}</div>
            <div className='text-xl font-bold text-[var(--txt-title-color)]'>{props.item.degree}: <span className='text-[var(--txt-accent-color)]'>{props.item.major}</span></div>
        </div>
    )
}