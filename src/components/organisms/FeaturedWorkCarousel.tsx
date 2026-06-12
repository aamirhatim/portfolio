import { useEffect, useState, useRef } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection, getStorageFolderReferences, loadImgIntoCache } from "../../lib/firestoreLib";
import { orderBy, where } from "firebase/firestore";
import { ProjectType } from "../../data/datatypes";
import useIsMobile from "../../lib/hooks/useIsMobile";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Chip from "../atoms/Chip";
import { useNavigate } from "react-router";
import { useAppContext } from "../../context/appContext";

const articleModules = import.meta.glob("/src/data/articles/*.json");

export default function FeaturedWorkCarousel() {
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();
    const navigate = useNavigate();
    const { setNavSelect } = useAppContext();

    const [spotlights, setSpotlights] = useState<ProjectType[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    const touchStartXRef = useRef<number | null>(null);

    // Fetch spotlight projects
    useEffect(() => {
        let active = true;
        const queryOptions = [
            where("spotlight", "==", true),
            orderBy("publishDate", "desc")
        ];

        getDocumentsFromCollection(firebaseAppContext, "projects", queryOptions).then(async (docs) => {
            if (!active) return;
            if (docs) {
                const projects = docs.map(doc => ({ ...doc.data, id: doc.id } as ProjectType));

                // For each project, resolve its hero image from Firebase Storage
                const projectsWithResolvedImg = await Promise.all(
                    projects.map(async (project) => {
                        try {
                            const folderPath = `proj_img/${project.id}`;
                            const references = await getStorageFolderReferences(firebaseAppContext, folderPath);
                            if (references && references.length > 0) {
                                // Find reference that starts with "hero." and has an accepted extension
                                const heroRef = references.find(r => {
                                    const nameLower = r.name.toLowerCase();
                                    return nameLower.startsWith("hero.") &&
                                        (nameLower.endsWith(".jpg") ||
                                            nameLower.endsWith(".png") ||
                                            nameLower.endsWith(".jpeg") ||
                                            nameLower.endsWith(".webp") ||
                                            nameLower.endsWith(".tiff"));
                                });
                                if (heroRef) {
                                    const imgUrl = await loadImgIntoCache(firebaseAppContext, heroRef.fullPath);
                                    if (imgUrl) {
                                        return { ...project, img: imgUrl };
                                    }
                                }
                            }
                        } catch (err) {
                            console.error(`Failed to resolve storage hero image for project ${project.id}:`, err);
                        }
                        return project;
                    })
                );

                if (active) {
                    setSpotlights(projectsWithResolvedImg);
                }
            }
            if (active) {
                setLoading(false);
            }
        });

        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

    // Autoplay timer logic
    useEffect(() => {
        if (spotlights.length <= 1) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % spotlights.length);
        }, 5000);

        return () => clearInterval(timer);
    }, [spotlights.length, currentIndex]);

    // Manual navigation controls
    const nextSlide = () => {
        if (spotlights.length === 0) return;
        setCurrentIndex((prev) => (prev + 1) % spotlights.length);
    };

    const prevSlide = () => {
        if (spotlights.length === 0) return;
        setCurrentIndex((prev) => (prev - 1 + spotlights.length) % spotlights.length);
    };

    // Mobile swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartXRef.current = e.changedTouches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        if (touchStartXRef.current === null) return;
        const touchEndX = e.changedTouches[0].clientX;
        const diffX = touchEndX - touchStartXRef.current;

        // 50px swipe threshold
        if (diffX > 50) {
            prevSlide();
        } else if (diffX < -50) {
            nextSlide();
        }
        touchStartXRef.current = null;
    };

    if (loading) {
        return (
            <div className={`w-full bg-stone-950 border-y md:border border-stone-800 ${isMobile ? '-mx-4 w-[calc(100%+2rem)] rounded-none' : 'rounded-xl'} h-[280px] animate-pulse flex items-center justify-center select-none`}>
                <div className="h-6 w-32 bg-stone-800/80 rounded-sm" />
            </div>
        );
    }

    if (spotlights.length === 0) {
        return null; // Don't render anything if no spotlight projects exist
    }

    return (
        <div className={`flex flex-col mb-8 select-none ${isMobile ? '-mx-4 w-[calc(100%+2rem)]' : 'w-full'}`}>
            {/* Carousel Container */}
            <div
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                className={`relative w-full overflow-hidden bg-stone-950 border-y md:border border-stone-800 touch-pan-y ${isMobile ? 'rounded-none' : 'rounded-xl shadow-xs'
                    } h-[280px]`}
            >
                {spotlights.map((project, idx) => {
                    const isActive = idx === currentIndex;
                    const articlePath = `/src/data/articles/${project.id}.json`;
                    const hasArticle = !!articleModules[articlePath];

                    const handleTileClick = () => {
                        const url = `/projects/${project.id}`;
                        setNavSelect(url);
                        navigate(url);
                    };

                    const handleKeyDown = (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleTileClick();
                        }
                    };

                    return (
                        <div
                            key={project.id}
                            onClick={hasArticle ? handleTileClick : undefined}
                            onKeyDown={hasArticle ? handleKeyDown : undefined}
                            role={hasArticle ? "button" : undefined}
                            tabIndex={isActive && hasArticle ? 0 : -1}
                            aria-label={hasArticle ? `Read article about ${project.title}` : undefined}
                            className={`absolute inset-0 w-full h-full flex transition-opacity duration-700 ease-in-out ${isActive ? "opacity-100 z-10 pointer-events-auto" : "opacity-0 z-0 pointer-events-none"
                                } ${hasArticle ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-500" : ""}`}
                        >
                            {/* Background Image */}
                            {project.img && (
                                <img
                                    src={project.img}
                                    alt={project.title}
                                    className="absolute inset-0 w-full h-full object-cover z-0 select-none pointer-events-none"
                                />
                            )}

                            {/* Overlay Gradient to ensure text readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/85 to-stone-950/30 z-10 md:block hidden pointer-events-none" />
                            <div className="absolute inset-0 bg-stone-950/90 z-10 md:hidden block pointer-events-none" />

                            {/* Left Text Column */}
                            <div className="w-full md:w-[60%] flex flex-col justify-between p-6 md:p-8 h-full relative z-20">
                                <div>
                                    <h3 className="title font-bold mb-1 text-white">
                                        {project.title}
                                    </h3>
                                    <div className="text-sm text-stone-300 leading-relaxed line-clamp-3 md:line-clamp-4">
                                        {project.description}
                                    </div>
                                </div>
                                <div className="flex gap-1.5 flex-wrap">
                                    {project.skills.slice(0, 4).map((skill) => (
                                        <Chip key={skill} text={skill} classes="border border-white text-white" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop Center Navigation Buttons */}
            {spotlights.length > 1 && (
                <div className="hidden md:flex justify-center items-center gap-3 mt-4 select-none">
                    <button
                        onClick={prevSlide}
                        className="p-1 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-500 dark:text-stone-400 hover:text-(--txt-title-color) transition-colors cursor-pointer"
                        aria-label="Previous spotlight slide"
                    >
                        <ChevronLeft size={16} />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="p-1 rounded-full border border-stone-200 dark:border-stone-800 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-500 dark:text-stone-400 hover:text-(--txt-title-color) transition-colors cursor-pointer"
                        aria-label="Next spotlight slide"
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            )}
        </div>
    );
}
