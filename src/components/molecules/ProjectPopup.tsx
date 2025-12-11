import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/appContext";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getStorageFolderReferences, loadImgIntoCache } from "../../lib/firestoreLib";
import { AnimatePresence, motion } from "motion/react";
import ReactDOM from "react-dom";

interface ProjectPopupProps {
    refDiv: React.RefObject<HTMLDivElement|null>,
    projectId:string,
}

export default function ProjectPopup(props:ProjectPopupProps) {
    const { refDiv, projectId } = props;

    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const { imgUrlCache, setImgUrlCache } = useAppContext();

    // Init state
    const [vis, setVis] = useState<boolean>(false);
    const [previewsLoaded, setPreviewsLoaded] = useState<boolean>(false);
    const [fileUrls, setFileUrls] = useState<string[]>([]);

    // Create refs
    const popupRef = useRef<HTMLDivElement>(null);

    // Animations
    const initial = {
        opacity: 0,
        height: 0,
        width: 0
    };
    const animate = {
        opacity: 1,
        height: '200px',
        width: '300px'
    };
    const exit = initial;

    // Get all preview images for project
    useEffect(() => {
        const getFileUrls = async () => {
            // Get file references
            const folderPath = `proj_img/${projectId}/previews`;
            const references = await getStorageFolderReferences(firebaseAppContext, folderPath);
            if (!references) return;

            // Load images into url cache
            let urls:string[] = [];
            const promises = references.map(async r => {
                const imgUrl = await loadImgIntoCache(firebaseAppContext, r.fullPath, imgUrlCache, setImgUrlCache);
                
                // Add path to url array
                if (imgUrl) {
                    urls.push(imgUrl);
                }
            });

            // Wait for all cache loads to complete
            await Promise.all(promises);
            
            // Update states
            setFileUrls(urls);
            setPreviewsLoaded(true);
        };

        getFileUrls();
    }, []);
    
    // Create mouse event listeners once files have been loaded
    useEffect(() => {
        if (!props.refDiv.current || !previewsLoaded) return;

        // Exit if no images are in the cache for this project
        if (fileUrls.length === 0) return;

        // Initialize interval to update preview every second
        let interval:NodeJS.Timeout;
        let idx = 0;
        const intervalHandler = () => {
            if (!popupRef.current) return;
            idx++;

            // Reset index if past file url array length
            if (idx >= fileUrls.length) {
                idx = 0;
            }

            // Set bg image
            popupRef.current.style.backgroundImage = `url("${fileUrls[idx]}")`;
        };

        const handleMouseEnter = () => {
            // Show popup
            setVis(true);

            // Create interval to cycle through previews
            interval = setInterval(intervalHandler, 1000);
        };

        const handleMouseLeave = () => {
            // Hide popup
            setVis(false);

            // Clear interval
            clearInterval(interval);
            idx = 0;
        };

        const handleMouseMove = (e:MouseEvent) => {
            if (!refDiv.current || !popupRef.current) return;

            // Define offset
            const offsetY = 20;
            const offsetX = 20;

            // Subtract refrence from mouse pos and add some buffer
            popupRef.current.style.left = `${e.pageX + offsetX}px`;
            popupRef.current.style.top = `${e.pageY + offsetY}px`;
        }

        // Add listeners to project's root div
        props.refDiv.current.addEventListener('mouseenter', handleMouseEnter);
        props.refDiv.current.addEventListener('mouseleave', handleMouseLeave);
        props.refDiv.current.addEventListener('mousemove', handleMouseMove);

        // Cleanup on unmount
        return () => {
            if (!props.refDiv.current) return;
            props.refDiv.current.removeEventListener('mouseenter', handleMouseEnter);
            props.refDiv.current.removeEventListener('mouseleave', handleMouseLeave);
            props.refDiv.current.removeEventListener('mousemove', handleMouseMove);

            // Clear interval
            clearInterval(interval);
            idx = 0;
        }
    }, [previewsLoaded]);

    // Set initial bg image when vis is enabled
    useEffect(() => {
        if (!vis || !popupRef.current || fileUrls.length === 0) return;

        popupRef.current.style.backgroundImage = `url("${fileUrls[0]}")`;
    }, [vis]);

    // Find portal target
    const portalRoot = document.getElementById('portal-root') || document.body;

    // Define element to render
    const popupElement = (
        <AnimatePresence>
            {vis &&
                <motion.div
                    ref={popupRef}
                    className={`fixed box-border border bg-center bg-cover z-[9999]`}
                    initial={initial}
                    animate={animate}
                    exit={exit}
                />
            }
        </AnimatePresence>
    );

    // Render element via React portal
    return ReactDOM.createPortal(popupElement, portalRoot);
}