export default function SkillType(props: {title: string, description: string}) {
    return (
        <div className='box-border w-80 border rounded-xl p-10'>
            <div className={'mb-4 font-bold text-3xl'}>{props.title}</div>
            <div className='text-xl'>{props.description}</div>
        </div>
    )
}