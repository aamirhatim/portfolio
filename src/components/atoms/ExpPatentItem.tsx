import { PatentType } from '../../data/datatypes'

export default function ExpPatentItem(props: {item: PatentType}) {
    return (
        <div className='box-border flex flex-col justify-start gap-2'>
            <div className='flex gap-3 items-center'>
                <div className='box-border border rounded-sm title text-sm px-2 w-min'>{props.item.status.toUpperCase()}</div>
                {props.item.status === "granted" && 
                <a href={props.item.url} target='_blank'>
                    <div className='text-sm underline'>US Patent No. {props.item.number}</div>
                </a>
                }
            </div>
            <div className='text-2xl title text-(--txt-title-color)'>{props.item.title}</div>
            <div className='text-lg'>{props.item.description}</div>
        </div> 
    )
}