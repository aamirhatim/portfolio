export default function ProjectLink(props: {value:string, url:string}) {
    const handleClick = (e:React.MouseEvent) => {
        e.stopPropagation();
        window.open(props.url, '_blank');
    };

    return (
        <div onClick={handleClick} className='text-sm font-bold text-(--txt-link-color)'>
            <a>{`{ ${props.value} }`}</a>
        </div>
    )
}