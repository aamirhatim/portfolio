import { EducationType } from '../../data/datatypes'

export default function ExpEduItem(props: {item:EducationType}){
    return (
        <div className='flex flex-col gap-2'>
            <div className='text-lg text-(--txt-subtitle-color)'>{props.item.school} - {props.item.end}</div>
            <div className='text-2xl title text-(--txt-title-color)'>{props.item.degree.long}: <span className='text-(--txt-accent-color)'>{props.item.field}</span></div>
        </div>
    )
}