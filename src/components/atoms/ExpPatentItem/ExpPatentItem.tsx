import { Patent } from '../../../data/datatypes'

function ExpPatentItem(props: {item: Patent}) {
    return (
        <div className='box-border p-5 border rounded-xl flex flex-col justify-start items-center w-70 gap-4'>
            <div className='box-border border rounded-full text-sm font-bold px-2'>{props.item.status}</div>
            <div className='text-center text-xl font-bold'>{props.item.title}</div>
            <div className='text-lg'>{props.item.description}</div>
        </div> 
    )
}

export default ExpPatentItem