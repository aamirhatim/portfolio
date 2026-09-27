import { Video, Newspaper, Link as LinkIcon, GitBranch } from 'lucide-react';
import { useNavigate } from 'react-router';
import { useAppContext } from '../../context/appContext';
import ParallaxWrapper from './ParallaxWrapper';

export default function ProjectLink(props: {value:string, url:string, newTab?:boolean, showText?:boolean}) {
    const { setNavSelect } = useAppContext();
    const navigate = useNavigate();

    const navigateToLink = () => {
        if (props.newTab) {
            window.open(props.url, '_blank');
        } else {
            setNavSelect(props.url);
            navigate(props.url);
        }
    };

    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        navigateToLink();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            e.stopPropagation();
            navigateToLink();
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

    const isBoxed = props.showText;
    const containerClasses = isBoxed 
        ? `flex items-center justify-center h-10 border border-(--border-color) rounded-lg px-4 hover:bg-(--color-accent-bg-subtle)`
        : 'p-1.5 rounded-md hover:bg-(--bg-interactive-hover)';

    return (
        <ParallaxWrapper multiplier={6}>
            <div
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                role="button"
                tabIndex={0}
                className={`cursor-pointer select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-(--border-focus) ${containerClasses}`}
            >
                <div className='!no-underline flex items-center justify-center gap-2'>
                    {renderIcon()}
                    {isBoxed && (
                        <div className='text-md text-(--txt-subtitle-color) font-medium'>{props.value}</div>
                    )}
                </div>
            </div>
        </ParallaxWrapper>
    );
}