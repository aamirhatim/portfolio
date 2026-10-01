import { useEffect, useRef, useState, useCallback } from "react";
import { Plus, X, Loader2 } from "lucide-react";
import { useFirebaseAppContext } from "../../../context/firebaseAppContext";
import { deleteProjectPreviewImage, fetchProjectPreviewImages, uploadProjectPreviewImage } from "../../../lib/adminLib";

interface StagedImageItem {
    id: string;
    url: string;
    type: 'existing' | 'new';
    file?: File;
    storagePath?: string;
}

interface ProjectPreviewsEditorProps {
    projectId: string | null;
    saveRef?: React.MutableRefObject<((targetProjectId: string) => Promise<void>) | null>;
    disabled?: boolean;
}

const MAX_IMAGES = 6;

/**
 * ProjectPreviewsEditor manages up to 6 preview images displayed in a 4:3 aspect ratio.
 * Staged additions and deletions only commit to Firebase Storage when the parent form triggers save.
 */
export default function ProjectPreviewsEditor({
    projectId,
    saveRef,
    disabled = false
}: ProjectPreviewsEditorProps) {
    const firebaseApp = useFirebaseAppContext();
    const [images, setImages] = useState<StagedImageItem[]>([]);
    const [stagedDeletions, setStagedDeletions] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(Boolean(projectId));

    const [prevProjectId, setPrevProjectId] = useState<string | null>(projectId);
    if (projectId !== prevProjectId) {
        setPrevProjectId(projectId);
        setLoading(Boolean(projectId));
        setImages([]);
        setStagedDeletions([]);
    }

    const fileInputRef = useRef<HTMLInputElement>(null);
    const createdUrlsRef = useRef<Set<string>>(new Set());

    // Track staged state in refs for the save callback
    const imagesRef = useRef(images);
    const stagedDeletionsRef = useRef(stagedDeletions);

    useEffect(() => {
        imagesRef.current = images;
        stagedDeletionsRef.current = stagedDeletions;
    }, [images, stagedDeletions]);

    // Load existing preview images from Storage on mount if editing an existing project
    useEffect(() => {
        if (!projectId) return;

        let active = true;

        fetchProjectPreviewImages(firebaseApp, projectId).then((items) => {
            if (!active) return;
            const mapped: StagedImageItem[] = items.map((item) => ({
                id: item.fullPath,
                url: item.url,
                type: 'existing',
                storagePath: item.fullPath
            }));
            setImages(mapped);
            setLoading(false);
        }).catch((err) => {
            console.error("Error loading preview images:", err);
            if (active) setLoading(false);
        });

        return () => {
            active = false;
        };
    }, [firebaseApp, projectId]);

    // Cleanup all created object URLs on unmount to avoid memory leaks
    useEffect(() => {
        const createdUrls = createdUrlsRef.current;
        return () => {
            createdUrls.forEach(url => URL.revokeObjectURL(url));
            createdUrls.clear();
        };
    }, []);

    // Handle user selecting images via the native file picker
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const imageFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        const availableSlots = MAX_IMAGES - images.length;
        const toAdd = imageFiles.slice(0, availableSlots);

        const newItems: StagedImageItem[] = toAdd.map(file => {
            const objectUrl = URL.createObjectURL(file);
            createdUrlsRef.current.add(objectUrl);
            return {
                id: crypto.randomUUID(),
                url: objectUrl,
                type: 'new',
                file
            };
        });

        setImages(prev => [...prev, ...newItems]);

        // Reset file input so the same file could be selected again if needed
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    // Remove an image from the staged list
    const handleDeleteImage = (item: StagedImageItem) => {
        if (disabled) return;

        if (item.type === 'existing' && item.storagePath) {
            setStagedDeletions(prev => [...prev, item.storagePath!]);
        } else if (item.type === 'new') {
            URL.revokeObjectURL(item.url);
            createdUrlsRef.current.delete(item.url);
        }

        setImages(prev => prev.filter(img => img.id !== item.id));
    };

    // Commit changes to Firebase Storage on save concurrently
    const commitChanges = useCallback(async (targetProjectId: string) => {
        const deletions = stagedDeletionsRef.current;
        const currentImages = imagesRef.current;

        // 1. Delete removed images concurrently
        await Promise.all(
            deletions.map(async (fullPath) => {
                try {
                    await deleteProjectPreviewImage(firebaseApp, fullPath);
                } catch (err) {
                    console.error(`Failed to delete preview image at ${fullPath}:`, err);
                }
            })
        );

        // 2. Upload newly added images concurrently
        const newImages = currentImages.filter(img => img.type === 'new' && img.file);
        await Promise.all(
            newImages.map(async (item) => {
                try {
                    await uploadProjectPreviewImage(firebaseApp, targetProjectId, item.file!);
                } catch (err) {
                    console.error(`Failed to upload preview image ${item.file?.name}:`, err);
                } finally {
                    URL.revokeObjectURL(item.url);
                    createdUrlsRef.current.delete(item.url);
                }
            })
        );
    }, [firebaseApp]);

    // Attach commit handler to saveRef
    useEffect(() => {
        if (saveRef) {
            saveRef.current = commitChanges;
        }
        return () => {
            if (saveRef) {
                saveRef.current = null;
            }
        };
    }, [saveRef, commitChanges]);

    return (
        <div className="flex flex-col gap-2 mt-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[var(--txt-subtitle-color)]">
                    Popup Preview Images <span className="text-xs font-normal opacity-80">({images.length}/{MAX_IMAGES})</span>
                </label>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 py-4 text-xs text-[var(--txt-subtitle-color)]">
                    <Loader2 size={16} className="animate-spin" />
                    <span>Loading preview images...</span>
                </div>
            ) : (
                <div className="flex flex-wrap gap-3 items-center mt-1">
                    {images.map(img => (
                        <div
                            key={img.id}
                            className="relative group w-32 aspect-[4/3] rounded-lg overflow-hidden border border-[var(--border-color)] bg-[var(--bg-color)] shrink-0"
                        >
                            <img
                                src={img.url}
                                alt="Popup Preview"
                                className="w-full h-full object-cover select-none pointer-events-none"
                            />
                            {!disabled && (
                                <button
                                    type="button"
                                    onClick={() => handleDeleteImage(img)}
                                    className="absolute top-1.5 right-1.5 p-1 rounded-full bg-black/70 hover:bg-[var(--feedback-error)] text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-md"
                                    title="Remove preview image"
                                    aria-label="Remove preview image"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>
                    ))}

                    {/* Dashed Add Box if under limit */}
                    {images.length < MAX_IMAGES && (
                        <button
                            type="button"
                            disabled={disabled}
                            onClick={() => fileInputRef.current?.click()}
                            className="w-32 aspect-[4/3] shrink-0 border-2 border-dashed border-[var(--border-color)] hover:border-[var(--txt-feature-color)] rounded-lg flex items-center justify-center cursor-pointer transition-colors text-[var(--txt-subtitle-color)] hover:text-[var(--txt-feature-color)] bg-[var(--bg-color)]/40 hover:bg-[var(--bg-color)] disabled:opacity-50 disabled:cursor-not-allowed group"
                            title="Add preview image"
                        >
                            <Plus size={24} className="group-hover:scale-110 transition-transform" />
                        </button>
                    )}

                    {/* Hidden Native File Picker */}
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        disabled={disabled}
                        onChange={handleFileSelect}
                        className="hidden"
                    />
                </div>
            )}
        </div>
    );
}
