import { PatentType } from '../../data/datatypes'

export default function ExpPatentItem(props: { item: PatentType }) {
    return (
        <div className='box-border flex flex-col justify-start gap-2'>
            <div className='flex gap-3 items-center'>
                <div className='box-border border rounded-sm title text-sm text-(--txt-subtitle-color) px-2 w-min'>{props.item.status.toUpperCase()}</div>
                {props.item.status === "granted" && <div className='text-sm underline'>US Patent No. {props.item.number}</div>}
            </div>
            <div className='text-2xl title'>{props.item.title}</div>
            <div className='text-lg'>{props.item.description}</div>
        </div>
    )
}