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
    const [vis, setVis] = useState<boolean>(false);
    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [fileUrls, setFileUrls] = useState<string[]>([]);
    const [bgImgUrl, setBgImgUrl] = useState<string>("");

    // Create refs
    const indexRef = useRef<number>(0);
    const popupRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });

    // Exit animation hook
    const hasTransitionedIn = useMountTransition(vis, 300);

    // Manage visibility and background image cycling
    useEffect(() => {
        if (isHovered && fileUrls.length > 0) {
            setVis(true);
            indexRef.current = 0;
            setBgImgUrl(fileUrls[0]);

            const id = setInterval(() => {
                indexRef.current = (indexRef.current + 1) % fileUrls.length;
                setBgImgUrl(fileUrls[indexRef.current]);
            }, 1000);

            return () => clearInterval(id);
        } else {
            setVis(false);
        }
    }, [isHovered, fileUrls]);

    // Handler for mouse enter event
    const handleMouseEnter = useCallback(() => {
        setIsHovered(true);
    }, []);

    // Handler for mouse leave event
    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    // Handler for mouse movement
    const handleMouseMove = useCallback((e: MouseEvent) => {
        // Define offset
        const offsetY = 20;
        const offsetX = 20;

        mousePos.current = { x: e.clientX + offsetX, y: e.clientY + offsetY };
        
        // Directly update DOM to avoid react re-renders
        if (popupRef.current) {
            popupRef.current.style.transform = `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`;
        }
    }, []);

    // Helper to get file URLs and update state
    const getFileUrls = useCallback(async () => {
        // Get file references
        const folderPath = `proj_img/${projectId}/previews`;
        const references = await getStorageFolderReferences(firebaseAppContext, folderPath);
        if (!references) return;

        // Load images into url cache
        let urls: string[] = [];
        const promises = references.map(async r => {
            const imgUrl = await loadImgIntoCache(firebaseAppContext, r.fullPath);

            // Add path to url array
            if (imgUrl) {
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
                urls.push(imgUrl);
            }
        });

        // Wait for all cache loads and preloads to complete
        await Promise.all(promises);

        // Update states
        setFileUrls(urls);
    }, [firebaseAppContext, projectId]);

    // Get all preview images for project
    useEffect(() => {
        getFileUrls();
    }, [getFileUrls]);

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
    // We add the styles only when both vis && hasTransitionedIn are true
    const isShowing = vis && hasTransitionedIn;
    const visibilityClasses = isShowing ? 'opacity-100 h-[200px] w-[300px]' : 'opacity-0 h-0 w-0';

    // Define element to render
    const popupElement = (
        (vis || hasTransitionedIn) && (
            <div
                ref={popupRef}
                className={`fixed top-0 left-0 box-border rounded-xl border bg-center bg-cover z-[9999] transition-[opacity,height,width] duration-300 ease-out ${visibilityClasses}`}
                style={{ transform: `translate(${mousePos.current.x}px, ${mousePos.current.y}px)`, backgroundImage: `url("${bgImgUrl}")` }}
            />
        )
    );

    // Render element via React portal
    return useMemo(() =>
        ReactDOM.createPortal(popupElement, portalRoot),
        [popupElement, portalRoot]);
}