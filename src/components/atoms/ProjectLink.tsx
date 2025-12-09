import { faVideo, faNewspaper, faLink, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ProjectLink(props: {value:string, url:string}) {
    const handleClick = (e:React.MouseEvent) => {
        e.stopPropagation();
        window.open(props.url, '_blank');
    };

    const getIcon = () => {
        switch (props.value) {
            case "code":
                return faCodeBranch;

            case "video":
                return faVideo;

            case "blog":
                return faNewspaper;
        
            default:
                return faLink;
        }
    };

    return (
        <div onClick={handleClick} className='p-1 cursor-pointer'>
            <a><FontAwesomeIcon icon={getIcon()} size='sm' className='text-(--txt-subtitle-color)' /></a>
        </div>
    )
}