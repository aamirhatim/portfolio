export default function ProjectLink(props: {value:string, url:string}) {
    const handleClick = (e:React.MouseEvent) => {
        e.stopPropagation();
        window.open(props.url, '_blank');
    };

    return (
        <div onClick={handleClick} className='text-sm font-bold text-(--txt-link-color) cursor-pointer'>
            <a className="!no-underline">{`{ ${props.value} }`}</a>
        </div>
    )
}