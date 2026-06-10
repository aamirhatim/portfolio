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
    const [previewsLoaded, setPreviewsLoaded] = useState<boolean>(false);
    const [fileUrls, setFileUrls] = useState<string[]>([]);
    const [bgImgUrl, setBgImgUrl] = useState<string>("");

    // Create refs
    const intervalRef = useRef<NodeJS.Timeout | undefined>(undefined);
    const indexRef = useRef<number>(0);
    const popupRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });

    // Exit animation hook
    const hasTransitionedIn = useMountTransition(vis, 300);

    // Initialize interval to update preview every second
    const intervalHandler = useCallback(() => {
        if (fileUrls.length === 0) return;

        // Increment index but reset if beyond bounds of fileUrl array
        indexRef.current = (indexRef.current + 1) % fileUrls.length;

        // Set bg image
        setBgImgUrl(fileUrls[indexRef.current]);
    }, [fileUrls.length, setBgImgUrl]);

    // Handler for mouse enter event
    const handleMouseEnter = useCallback(() => {
        setVis(true);           // Show popup
        indexRef.current = 0;   // Reset interval index

        // Update first image
        if (fileUrls.length > 0) {
            setBgImgUrl(fileUrls[0]);
        }

        // Create interval to cycle through previews
        intervalRef.current = setInterval(intervalHandler, 1000);
    }, [intervalHandler, fileUrls]);

    // Handler for mouse leave event
    const handleMouseLeave = useCallback(() => {
        setVis(false);  // Hide popup

        // Clear interval
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        indexRef.current = 0;
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
        setPreviewsLoaded(true);
    }, [firebaseAppContext, projectId]);

    // Get all preview images for project
    useEffect(() => {
        getFileUrls();
    }, [getFileUrls]);

    // Create mouse event listeners once files have been loaded
    useEffect(() => {
        if (!refDiv.current || !previewsLoaded) return;

        // Exit if no images are in the cache for this project
        if (fileUrls.length === 0) return;

        // Add listeners to project's root div
        refDiv.current.addEventListener('mouseenter', handleMouseEnter);
        refDiv.current.addEventListener('mouseleave', handleMouseLeave);
        refDiv.current.addEventListener('mousemove', handleMouseMove);

        // Cleanup on unmount
        return () => {
            if (!refDiv.current) return;
            refDiv.current.removeEventListener('mouseenter', handleMouseEnter);
            refDiv.current.removeEventListener('mouseleave', handleMouseLeave);
            refDiv.current.removeEventListener('mousemove', handleMouseMove);

            // Clear interval
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        }
    }, [previewsLoaded, fileUrls.length, handleMouseEnter, handleMouseLeave, handleMouseMove]);

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