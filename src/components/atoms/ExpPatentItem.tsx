import { PatentType } from '../../data/datatypes'

export default function ExpPatentItem(props: {item: PatentType}) {
    return (
        <div className='box-border p-5 border border-[var(--border-color)] rounded-xl flex flex-col justify-start w-[80%] min-w-100 gap-4'>
            <div className='flex gap-2 items-center'>
                <div className='box-border border rounded-full text-xs font-bold px-2 w-min'>{props.item.status}</div>
                {props.item.status === "GRANTED" && 
                <a href={props.item.url} target='_blank'>
                    <div className='text-sm font-bold underline'>US Patent No. {props.item.number}</div>
                </a>
                }
            </div>
            <div className='text-lg font-bold text-[var(--txt-title-color)]'>{props.item.title}</div>
            <div className='text-md'>{props.item.description}</div>
        </div> 
    )
}