import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

interface LazyImgProps {
    imgPath: string,
    alt: string,
    className: string,
    fill?: boolean,
    positionClass?: string,
    placeholderPath?: string,
}

// Module-level cache to share across instances without triggering React context re-renders
const moduleImgCache = new Map<string, string>();

export default function LazyImg(props:LazyImgProps) {
    // Get context
    const fireBaseAppContext = useFirebaseAppContext();
    const firebaseStorage = useMemo(() => getStorage(fireBaseAppContext), [fireBaseAppContext]);

    // Init state
    const placeholder = props.placeholderPath ? props.placeholderPath : "/placeholder.gif";
    const [imgUrl, setImgUrl] = useState<string>(placeholder);
    const [gotFinalUrl, setGotFinalUrl] = useState<boolean>(false);
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);

    // Create refs
    const imgRef = useRef<HTMLImageElement>(null);

    // Define styling
    const imgClasses = `${props.fill ? 'object-fill' : 'object-cover'} ${props.positionClass}`;
    const overlayOpacityClasses = (gotFinalUrl && imgLoaded) ? 'opacity-0' : 'opacity-100';

    // Image loader helper
    const loadImage = useCallback(async () => {
        let url:string;

        // Check module cache first
        if (moduleImgCache.has(props.imgPath)) {
            url = moduleImgCache.get(props.imgPath)!;
        } else {
            // Get url from Firebase Storage
            try {
                const imgRefFromStorage = ref(firebaseStorage, props.imgPath);
                url = await getDownloadURL(imgRefFromStorage);

                // Save URL to cache
                moduleImgCache.set(props.imgPath, url);
            } catch (error) {
                console.error("Failed to load image or get download URL:", error);
                setImgUrl(placeholder);
                setImgLoaded(false);
                return;
            }
        }

        // Set final image url
        setGotFinalUrl(true);
        setImgUrl(url);
    }, [firebaseStorage, props.imgPath, placeholder]);

    // useEffect for setting up observer
    useEffect(() => {
        if (!imgRef.current) return;

        // Create observer
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Load img then stop observing
                        loadImage();
                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                rootMargin: "250px", // Load 250px outside of viewport
                threshold: 0.05, // Trigger when 5% of img is visible
            }
        );

        // Start observing the image element
        observer.observe(imgRef.current);

        // Disconnect observer on dismount
        return () => {
            if (imgRef.current) {observer.unobserve(imgRef.current)};
            observer.disconnect();
        }
    }, [loadImage, imgRef, props.imgPath, props.placeholderPath]);

    return (
        <div className={`overflow-clip ${props.className}`}>
            <div className="relative h-full w-full">
                <img
                    ref={imgRef}
                    src={imgUrl}
                    alt={props.alt}
                    onLoad={() => {
                        if (gotFinalUrl) {
                            setImgLoaded(true);
                        }
                    }}
                    onError={() => {
                        console.error(`Error loading image: ${imgUrl}`);
                        setImgUrl(placeholder);
                    }}
                    className={`h-full w-full ${imgClasses}`}
                />
                <div className={`absolute top-0 left-0 h-full w-full backdrop-blur-md transition-opacity duration-500 ${overlayOpacityClasses}`}></div>
            </div>
        </div>
    )
}