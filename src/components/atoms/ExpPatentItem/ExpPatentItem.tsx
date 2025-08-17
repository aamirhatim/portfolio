import { Patent } from '../../../data/datatypes'

function ExpPatentItem(props: {item: Patent}) {
    return (
        <div className='box-border p-5 border border-violet-700 rounded-xl flex flex-col justify-start w-[80%] min-w-100 gap-4'>
            <div className='flex gap-2 items-center'>
                <div className='box-border border rounded-full text-xs font-bold px-2 w-min'>{props.item.status}</div>
                {props.item.status === "GRANTED" && 
                    <a href={props.item.url} target='_blank'>
                        <div className='text-sm font-bold underline'>US Patent No. {props.item.number}</div>
                    </a>
                }
            </div>
            <div className='text-lg font-bold text-blue-400'>{props.item.title}</div>
            <div className='text-md'>{props.item.description}</div>
        </div> 
    )
}

export default ExpPatentItem