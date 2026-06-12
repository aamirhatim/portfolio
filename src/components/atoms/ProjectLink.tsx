import { Video, Newspaper, Link as LinkIcon, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../../context/appContext';

export default function ProjectLink(props: {value:string, url:string, newTab?:boolean, showText?:boolean}) {
    const { setNavSelect } = useAppContext();
    const navigate = useNavigate();

    const handleClick = (e:React.MouseEvent) => {
        e.stopPropagation();
        if (props.newTab) {
            window.open(props.url, '_blank');
        } else {
            setNavSelect(props.url);
            navigate(props.url);
        }
    };

    /**
     * Maps the project link type to the corresponding Lucide icon component.
     */
    const renderIcon = () => {
        const className = "text-(--txt-subtitle-color) w-4 h-4";
        switch (props.value.toLowerCase()) {
            case "code":
                return <GitBranch className={className} />;
            case "video":
                return <Video className={className} />;
            case "blog":
            case "article":
                return <Newspaper className={className} />;
            default:
                return <LinkIcon className={className} />;
        }
    };

    return (
        <div onClick={handleClick} className={`p-1 cursor-pointer ${props.showText && 'px-4 py-2 border border-(--border-color) rounded-lg'}`}>
            <a className='!no-underline flex gap-4 items-center'>
                {renderIcon()}
                {props.showText && <div className='text-md text-(--txt-subtitle-color)'>{props.value}</div>}
            </a>
        </div>
    )
}