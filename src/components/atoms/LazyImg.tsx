import { useEffect, useRef, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

interface LazyImgProps {
    imgPath: string,
    alt: string,
    className: string,
    position?: string,
    placeholderPath: string,
}

export default function LazyImg(props:LazyImgProps) {
    // Get context
    const fireBaseAppContext = useFirebaseAppContext();
    const firebaseStorage = getStorage(fireBaseAppContext);

    // Init state
    const [imgUrl, setImgUrl] = useState<string>(props.placeholderPath);
    const [imgLoaded, setImgLoaded] = useState<boolean>(false);

    // Create refs
    const imgRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);

    // Image loader helper
    const loadImage = async () => {
        try {
            const imgRefFromStorage = ref(firebaseStorage, props.imgPath);
            const url = await getDownloadURL(imgRefFromStorage);

            const fullImg = new Image();
            await new Promise<void>((resolve, reject) => {
                fullImg.onload = () => {resolve()};
                fullImg.onerror = (e) => {
                    console.error("Failed to load full image object:", e);
                    reject();
                };
                fullImg.src = url;
            });

            setImgUrl(url);
            setImgLoaded(true);
        } catch (error) {
            console.error("Failed to load image:", error);
            setImgUrl(props.placeholderPath);
            setImgLoaded(false);
        }
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

    // useEffect for updating bg image
    useEffect(() => {
        if (!imgRef.current || !overlayRef.current) return;

        imgRef.current.style.backgroundImage = `url(${imgUrl})`;
        imgRef.current.style.backgroundPosition = props.position ? props.position : "center";
        imgRef.current.style.backgroundSize = "cover";
        imgRef.current.style.backgroundRepeat = "no-repeat";

        if (imgLoaded) {
            overlayRef.current.style.opacity = "0";
        } else {
            overlayRef.current.style.opacity = "1";
        }
    }, [imgUrl, imgLoaded]);

    return (
        <div ref={imgRef} className={`relative ${props.className}`}>
            <div ref={overlayRef} className="absolute top-0 left-0 h-full w-full backdrop-blur-md transition-opacity duration-500"></div>
        </div>
    )
}