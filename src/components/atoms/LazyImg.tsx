import { useEffect, useRef, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { useAppContext } from "../../context/appContext";

interface LazyImgProps {
    imgPath: string,
    alt: string,
    className: string,
    fill?: boolean,
    positionClass?: string,
    placeholderPath?: string,
}

export default function LazyImg(props:LazyImgProps) {
    // Get context
    const fireBaseAppContext = useFirebaseAppContext();
    const firebaseStorage = getStorage(fireBaseAppContext);
    const { imgUrlCache, setImgUrlCache } = useAppContext();

    // Init state
    const placeholder = props.placeholderPath ? props.placeholderPath : "/placeholder.gif";
    const [imgUrl, setImgUrl] = useState<string>(placeholder);
    const [gotFinalUrl, setGotFinalUrl] = useState<boolean>(false);
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);

    // Create refs
    const imgRef = useRef<HTMLImageElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Image loader helper
    const loadImage = async () => {
        let cache = imgUrlCache;
        let url:string;

        // Check cache first
        if (cache.has(props.imgPath)) {
            // console.log(`Cache HIT for: ${props.imgPath}`);
            url = cache.get(props.imgPath)!;
        } else {
            // console.log(`Cache MISS for: ${props.imgPath}. Fetching from Firebase...`);

            // Get url from Firebase Storage
            try {
                const imgRefFromStorage = ref(firebaseStorage, props.imgPath);
                url = await getDownloadURL(imgRefFromStorage);

                // Save URL to cache
                cache.set(props.imgPath, url);
                setImgUrlCache(cache);
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
    };

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
    }, [props.imgPath, props.placeholderPath]);

    // Handle overlay opacity when final image completes loading
    useEffect(() => {
        if (!overlayRef.current) return;
        if (!gotFinalUrl) return;

        if (imgLoaded) {
            overlayRef.current.style.opacity = "0";
        } else {
            overlayRef.current.style.opacity = "1";
        }
    }, [imgLoaded, gotFinalUrl]);

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
                    className={`h-full w-full ${props.fill ? 'object-fill' : 'object-cover'} ${props.positionClass}`}
                />
                <div ref={overlayRef} className={`absolute top-0 left-0 h-full w-full backdrop-blur-md transition-opacity duration-500`}></div>
            </div>
        </div>
    )
}