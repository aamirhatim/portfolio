import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getStorageFolderReferences, loadImgIntoCache } from "../../lib/firestoreLib";
import useMountTransition from "../../lib/hooks/useMountTransition";
import useIsMobile from "../../lib/hooks/useIsMobile";
import ReactDOM from "react-dom";

interface ProjectPopupProps {
    refDiv: React.RefObject<HTMLDivElement | null>;
    projectId: string;
}

export default function ProjectPopup(props: ProjectPopupProps) {
    const { refDiv, projectId } = props;

    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();

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
    const rafIdRef = useRef<number | null>(null);

    // Clean up RAF on unmount
    useEffect(() => {
        return () => {
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        };
    }, []);

    // Exit animation hook (500ms delay to match gradual fade out duration)
    const hasTransitionedIn = useMountTransition(vis, 500);

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
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }
        setIsHovered(false);
    }, []);

    // Handler for mouse movement with viewport collision detection and RAF throttling
    const handleMouseMove = useCallback((e: MouseEvent) => {
        const popupWidth = 300;
        const popupHeight = 200;
        const offset = 20;

        let x = e.clientX + offset;
        let y = e.clientY + offset;

        // Flip horizontally if overflowing right edge
        if (x + popupWidth > window.innerWidth - 10) {
            x = e.clientX - popupWidth - offset;
        }
        // Flip vertically if overflowing bottom edge
        if (y + popupHeight > window.innerHeight - 10) {
            y = e.clientY - popupHeight - offset;
        }

        // Clamp to viewport bounds
        x = Math.max(10, x);
        y = Math.max(10, y);

        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
        }

        rafIdRef.current = requestAnimationFrame(() => {
            if (popupRef.current) {
                popupRef.current.style.setProperty('--mouse-x', `${x}px`);
                popupRef.current.style.setProperty('--mouse-y', `${y}px`);
            }
        });

        setHasCoords(prev => {
            if (!prev) {
                setMousePos({ x, y });
                return true;
            }
            return prev;
        });
    }, []);

    // Get all preview images for project (bypass on mobile)
    useEffect(() => {
        if (isMobile) return;

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
                            if ('decode' in img) {
                                img.decode().then(resolve).catch(resolve);
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
    }, [firebaseAppContext, projectId, isMobile]);

    // Create mouse event listeners
    useEffect(() => {
        if (isMobile || !refDiv.current) return;

        const currentRef = refDiv.current;
        currentRef.addEventListener('mouseenter', handleMouseEnter);
        currentRef.addEventListener('mouseleave', handleMouseLeave);
        currentRef.addEventListener('mousemove', handleMouseMove);

        return () => {
            currentRef.removeEventListener('mouseenter', handleMouseEnter);
            currentRef.removeEventListener('mouseleave', handleMouseLeave);
            currentRef.removeEventListener('mousemove', handleMouseMove);
        };
    }, [refDiv, handleMouseEnter, handleMouseLeave, handleMouseMove, isMobile]);

    // Find portal target
    const portalRoot = document.getElementById('portal-root') || document.body;

    // Determine visibility and entrance/exit animation classes
    const isShowing = vis && hasCoords;
    const innerAnimClasses = isShowing
        ? "animate-[flickerIn_0.35s_ease-out_forwards]"
        : "animate-[fadeOut_0.5s_ease-out_forwards]";

    // Render element via React portal
    return useMemo(() => {
        if (isMobile) return null;

        const popupElement = (
            (vis || hasTransitionedIn) && (
                <div
                    ref={popupRef}
                    className="fixed top-0 left-0 w-[300px] h-[200px] pointer-events-none z-[9999] will-change-transform"
                    style={{
                        transform: `translate3d(var(--mouse-x, ${mousePos.x}px), var(--mouse-y, ${mousePos.y}px), 0)`,
                    }}
                >
                    <div
                        className={`w-full h-full box-border rounded-xl border border-(--border-color) shadow-2xl overflow-hidden relative ${innerAnimClasses}`}
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
                </div>
            )
        );
        return ReactDOM.createPortal(popupElement, portalRoot);
    }, [isMobile, vis, hasTransitionedIn, fileUrls, bgImgIndex, mousePos, innerAnimClasses, portalRoot]);
}