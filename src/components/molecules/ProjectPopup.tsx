import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getStorageFolderReferences, loadImgIntoCache } from "../../lib/firestoreLib";
import useMountTransition from "../../lib/hooks/useMountTransition";
import ReactDOM from "react-dom";

interface ProjectPopupProps {
    refDiv: React.RefObject<HTMLDivElement | null>,
    projectId: string,
}

export default function ProjectPopup(props: ProjectPopupProps) {
    const { refDiv, projectId } = props;

    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [fileUrls, setFileUrls] = useState<string[]>([]);
    const [bgImgIndex, setBgImgIndex] = useState<number>(0);
    const [hasCoords, setHasCoords] = useState<boolean>(false);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const vis = isHovered && fileUrls.length > 0;
    const [prevVis, setPrevVis] = useState(vis);

    if (vis !== prevVis) {
        setPrevVis(vis);
        setBgImgIndex(0);
    }

    // Create refs
    const popupRef = useRef<HTMLDivElement>(null);

    // Exit animation hook
    const hasTransitionedIn = useMountTransition(vis, 300);

    // Manage background image cycling
    useEffect(() => {
        if (!vis || fileUrls.length <= 1) return;

        const id = setInterval(() => {
            setBgImgIndex(prev => (prev + 1) % fileUrls.length);
        }, 1000);

        return () => clearInterval(id);
    }, [vis, fileUrls]);

    // Handler for mouse enter event
    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    // Handler for mouse leave event
    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        setHasCoords(false);
    }, []);

    // Handler for mouse movement
    // Position using CSS variables set directly on the DOM in the mouse event handler to bypass React rendering loops and satisfy ref access rules
    const handleMouseMove = useCallback((e: MouseEvent) => {
        // Define offset
        const offsetY = 20;
        const offsetX = 20;
        const x = e.clientX + offsetX;
        const y = e.clientY + offsetY;

        if (popupRef.current) {
            popupRef.current.style.setProperty('--mouse-x', `${x}px`);
            popupRef.current.style.setProperty('--mouse-y', `${y}px`);
        }
        setHasCoords(prev => {
            if (!prev) {
                setMousePos({ x, y });
                return true;
            }
            return prev;
        });
    }, []);

    // Get all preview images for project
    useEffect(() => {
        let active = true;
        const folderPath = `proj_img/${projectId}/previews`;

        getStorageFolderReferences(firebaseAppContext, folderPath).then(async (references) => {
            if (!active || !references) return;

            const promises = references.map(async r => {
                const imgUrl = await loadImgIntoCache(firebaseAppContext, r.fullPath);

                if (imgUrl && active) {
                    // Ensure image is fully loaded by the browser
                    await new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => {
                            // Attempt to decode the image to ensure it's ready to be rendered
                            if ('decode' in img) {
                                img.decode().then(resolve).catch(resolve); // Proceed even if decode fails
                            } else {
                                resolve(true);
                            }
                        };
                        img.onerror = reject;
                        img.src = imgUrl;
                    });
                    return imgUrl;
                }
                return null;
            });

            // Wait for all cache loads and preloads to complete
            const results = await Promise.all(promises);
            if (active) {
                setFileUrls(results.filter((url): url is string => url !== null));
            }
        });

        return () => {
            active = false;
        };
    }, [firebaseAppContext, projectId]);

    // Create mouse event listeners
    useEffect(() => {
        if (!refDiv.current) return;

        // Add listeners to project's root div
        const currentRef = refDiv.current;
        currentRef.addEventListener('mouseenter', handleMouseEnter);
        currentRef.addEventListener('mouseleave', handleMouseLeave);
        currentRef.addEventListener('mousemove', handleMouseMove);

        // Cleanup on unmount
        return () => {
            currentRef.removeEventListener('mouseenter', handleMouseEnter);
            currentRef.removeEventListener('mouseleave', handleMouseLeave);
            currentRef.removeEventListener('mousemove', handleMouseMove);
        }
    }, [refDiv, handleMouseEnter, handleMouseLeave, handleMouseMove]);

    // Find portal target
    const portalRoot = document.getElementById('portal-root') || document.body;

    // Determine visibility class based on mount status and transition state
    // We add the styles only when both vis && hasTransitionedIn && hasCoords are true
    const isShowing = vis && hasTransitionedIn && hasCoords;
    const visibilityClasses = isShowing ? 'opacity-100 h-[200px] w-[300px]' : 'opacity-0 h-0 w-0';

    // Render element via React portal
    return useMemo(() => {
        const popupElement = (
            (vis || hasTransitionedIn) && (
                <div
                    ref={popupRef}
                    className={`fixed top-0 left-0 box-border rounded-xl border overflow-hidden z-[9999] transition-[opacity,height,width] duration-300 ease-out ${visibilityClasses}`}
                    style={{
                        transform: `translate(var(--mouse-x, ${mousePos.x}px), var(--mouse-y, ${mousePos.y}px))`,
                    }}
                >
                    {fileUrls.map((url, index) => (
                        <div
                            key={url}
                            className={`absolute inset-0 bg-center bg-cover transition-opacity duration-500 ${
                                index === bgImgIndex % fileUrls.length ? 'opacity-100' : 'opacity-0'
                            }`}
                            style={{
                                backgroundImage: `url("${url}")`
                            }}
                        />
                    ))}
                </div>
            )
        );
        return ReactDOM.createPortal(popupElement, portalRoot);
    }, [vis, hasTransitionedIn, fileUrls, bgImgIndex, mousePos, visibilityClasses, portalRoot]);
}