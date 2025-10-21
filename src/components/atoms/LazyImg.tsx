import { useEffect, useRef, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDownloadURL, getStorage, ref } from "firebase/storage";

interface LazyImgProps {
    imgPath: string,
    alt: string,
    className?: string,
    placeholderSrc: string,
}

export default function LazyImg(props:LazyImgProps) {
    // Get context
    const fireBaseAppContext = useFirebaseAppContext();
    const firebaseStorage = getStorage(fireBaseAppContext);

    // Init state
    const [imgUrl, setImgUrl] = useState<string>(props.placeholderSrc);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);

    // Create img ref
    const imgRef = useRef(null);

    // Image loader helper
    const loadImage = async () => {
        try {
            setIsLoading(true);
            setError(false);
            const imgRefFromStorage = ref(firebaseStorage, props.imgPath);
            const url = await getDownloadURL(imgRefFromStorage);
            setImgUrl(url);
        } catch (error) {
            console.error("Failed to load image:", error);
            setError(true);
            setImgUrl(props.placeholderSrc);
        } finally {
            setIsLoading(false);
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
                rootMargin: "100px", // Load 100px outside of viewport
                threshold: 0.1, // Trigger when 10% of img is visible
            }
        );

        // Start observing the image element
        observer.observe(imgRef.current);

        // Disconnect observer on dismount
        return () => {
            if (imgRef.current) {
                observer.unobserve(imgRef.current);
            }
            observer.disconnect();
        }
    }, [props.imgPath, props.placeholderSrc]);

    return (
        <img
            ref={imgRef}
            src={imgUrl}
            alt={props.alt}
            className={props.className}
        />
    )
}