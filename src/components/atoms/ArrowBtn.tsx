import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";
import { ChevronsRight } from "lucide-react";
import { useCallback } from "react";

export default function ArrowBtn(props: {
    text: string;
    link: string;
    className?: string;
    newTab?: boolean;
}) {
    const navigate = useNavigate();
    const { setNavSelect } = useAppContext();

    // Nav handler
    const handleNav = useCallback(() => {
        if (props.newTab) {
            window.open(props.link, '_blank');
        } else {
            setNavSelect(props.link);
            navigate(props.link);
        }
    }, [props.link, props.newTab, setNavSelect, navigate]);

    const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleNav();
        }
    }, [handleNav]);

    return (
        <div
            onClick={handleNav}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            className={`${props.className || ''} group/btn cursor-pointer w-fit !no-underline flex items-center gap-2 px-3 py-0.5 -mx-3 -my-0.5 text-(--txt-subtitle-color) hover:text-(--txt-highlight-color) transition-colors duration-150 active:scale-95 focus:outline-none focus-visible:ring-1 focus-visible:ring-(--border-focus) rounded-sm select-none`}
        >
            <span className="transition-transform duration-150 ease-out group-hover/btn:translate-x-1 will-change-transform">
                {props.text}
            </span>
            <ChevronsRight size={16} className="transition-transform duration-150 ease-out group-hover/btn:translate-x-2 will-change-transform" />
        </div>
    );
}