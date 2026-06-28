import { Video, Newspaper, Link as LinkIcon, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../../context/appContext';

export default function ProjectLink(props: {value:string, url:string, newTab?:boolean, showText?:boolean, expandOnHover?:boolean}) {
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

    const isBoxed = props.showText || props.expandOnHover;
    const containerClasses = isBoxed 
        ? `group/link flex items-center justify-center h-10 border border-(--border-color) rounded-lg transition-all duration-300 ${props.expandOnHover ? 'px-2 hover:px-4' : 'px-4'}`
        : 'p-1';

    return (
        <div onClick={handleClick} className={`cursor-pointer ${containerClasses}`}>
            <a className='!no-underline flex items-center justify-center'>
                {renderIcon()}
                {isBoxed && (
                    <div className={`overflow-hidden whitespace-nowrap transition-all duration-300 ${props.expandOnHover ? 'max-w-0 opacity-0 group-hover/link:max-w-[100px] group-hover/link:opacity-100 group-hover/link:pl-2' : 'max-w-[100px] opacity-100 pl-2'}`}>
                        <div className='text-md text-(--txt-subtitle-color)'>{props.value}</div>
                    </div>
                )}
            </a>
        </div>
    )
}