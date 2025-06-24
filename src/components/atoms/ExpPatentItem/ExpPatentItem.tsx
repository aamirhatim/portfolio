import { Patent } from '../../../data/datatypes'

function ExpPatentItem(props: {item: Patent}) {
    return (
        <div className='box-border p-5 border rounded-xl flex flex-col justify-start w-[80%] min-w-100 gap-4'>
            <div className='box-border border rounded-full text-xs font-bold px-2 w-min'>{props.item.status}</div>
            <div className='text-lg font-bold'>{props.item.title}</div>
            <div className='text-md'>{props.item.description}</div>
        </div> 
    )
}

export default ExpPatentItem