import { faVideo, faNewspaper, faLink, faCodeBranch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router';

export default function ProjectLink(props: {value:string, url:string, newTab?:boolean, showText?:boolean}) {
    const navigate = useNavigate();

    const handleClick = (e:React.MouseEvent) => {
        e.stopPropagation();
        if (props.newTab) {
            window.open(props.url, '_blank');
        } else {
            navigate(props.url);
        }
    };

    const getIcon = () => {
        switch (props.value.toLowerCase()) {
            case "code":
                return faCodeBranch;

            case "video":
                return faVideo;

            case "blog":
                return faNewspaper;

            case "article":
                return faNewspaper;
        
            default:
                return faLink;
        }
    };

    return (
        <div onClick={handleClick} className={`p-1 cursor-pointer ${props.showText && 'px-4 py-2 border border-(--border-color) rounded-lg'}`}>
            <a className='!no-underline flex gap-4 items-center'>
                <FontAwesomeIcon icon={getIcon()} size='sm' className='text-(--txt-subtitle-color)' />
                {props.showText && <div className='text-md text-(--txt-subtitle-color)'>{props.value}</div>}
            </a>
        </div>
    )
}