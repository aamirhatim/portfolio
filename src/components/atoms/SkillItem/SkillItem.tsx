function SkillItem(props: {value: string, type: string}) {
    return (
        <div className={`box-border px-3 py-1 border rounded-full font-bold text-lg`}>{props.value}</div>
    )
}

export default SkillItem