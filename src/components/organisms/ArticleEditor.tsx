import { useEffect, useState } from "react";
import { doc, getDoc, getFirestore, setDoc, deleteDoc } from "firebase/firestore";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentFromId } from "../../lib/firestoreLib";
import { ProjectType, ArticleType, ArticleBlockType } from "../../data/datatypes";
import {
    ChevronUp,
    ChevronDown,
    Trash2,
    Plus,
    Save,
    X,
    Grid3X3,
    List,
    Image,
    Code,
    ALargeSmall,
    Type,
    SquareFunction,
    RefreshCw,
    AlertCircle
} from "lucide-react";

import ArticleBlockRenderer from "../atoms/ArticleBlockRenderer";

// Map of local articles for local import fallback
const articleModules = import.meta.glob("/src/data/articles/*.json") as Record<string, () => Promise<ArticleType>>;

type ArticleEditorProps = {
    projectId: string;
    action: "create-new" | "import-local" | "edit";
    onCancel: () => void;
    onSave: () => void;
};

export default function ArticleEditor({ projectId, action, onCancel, onSave }: ArticleEditorProps) {
    const firebaseApp = useFirebaseAppContext();
    const db = getFirestore(firebaseApp);

    // Document States
    const [project, setProject] = useState<ProjectType | null>(null);
    const [blocks, setBlocks] = useState<ArticleBlockType[]>([]);
    const [createdAt, setCreatedAt] = useState("");
    const [lastUpdated, setLastUpdated] = useState("");
    const [isPublic, setIsPublic] = useState(false);
    const [publishDate, setPublishDate] = useState<string | undefined>(undefined);

    // UI States
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [previewTab, setPreviewTab] = useState<"edit" | "preview" | "split">("split");

    // Load initial data
    useEffect(() => {
        let active = true;
        const loadInitialData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetch project metadata
                const projDoc = await getDocumentFromId(firebaseApp, "projects", projectId);
                if (projDoc && active) {
                    setProject({ id: projDoc.id, ...projDoc.data } as ProjectType);
                }

                // Retrieve article content
                if (action === "edit") {
                    const artDoc = await getDoc(doc(db, "articles", projectId));
                    if (artDoc.exists() && active) {
                        const data = artDoc.data() as ArticleType;
                        setBlocks(data.blocks || []);
                        setCreatedAt(data.createdAt || "");
                        setLastUpdated(data.lastUpdated || "");
                        setIsPublic(data.public || false);
                        setPublishDate(data.publishDate);
                    } else if (active) {
                        setError("Could not find the Firestore article to edit.");
                    }
                } else if (action === "import-local") {
                    const localPath = `/src/data/articles/${projectId}.json`;
                    const importFn = articleModules[localPath];
                    if (importFn) {
                        const module = await importFn();
                        if (active) {
                            setBlocks(module.blocks || []);
                            setCreatedAt(new Date().toISOString().split("T")[0]);
                            setIsPublic(false);
                        }
                    } else if (active) {
                        // Fallback to blank if local static import not found
                        setBlocks([]);
                        setCreatedAt(new Date().toISOString().split("T")[0]);
                        setIsPublic(false);
                    }
                } else {
                    // new-create
                    if (active) {
                        setBlocks([]);
                        setCreatedAt(new Date().toISOString().split("T")[0]);
                        setIsPublic(false);
                    }
                }
            } catch (err) {
                console.error("Error loading editor data:", err);
                if (active) setError("An error occurred while setting up the editor workspace.");
            } finally {
                if (active) setLoading(false);
            }
        };

        loadInitialData();
        return () => { active = false; };
    }, [firebaseApp, projectId, action, db]);

    // Save article document
    const handleSaveDoc = async () => {
        setSaving(true);
        setError(null);
        try {
            const today = new Date().toISOString().split("T")[0];
            let finalCreatedAt = createdAt;
            let finalLastUpdated = lastUpdated;

            if (action === "create-new" || action === "import-local") {
                finalCreatedAt = today;
            } else {
                finalCreatedAt = createdAt || today;
                finalLastUpdated = today;
            }

            // Sync blocks orders
            const orderedBlocks = blocks.map((b, idx) => ({
                ...b,
                order: idx,
                projectId: projectId
            })) as ArticleBlockType[];

            const payload: ArticleType = {
                blocks: orderedBlocks,
                public: isPublic,
                createdAt: finalCreatedAt
            };

            if (publishDate) payload.publishDate = publishDate;
            if (finalLastUpdated) payload.lastUpdated = finalLastUpdated;

            await setDoc(doc(db, "articles", projectId), payload);
            onSave();
        } catch (err) {
            console.error("Error saving article:", err);
            setError("Failed to save article to Firestore. Please check database permissions.");
        } finally {
            setSaving(false);
        }
    };

    // Delete article document
    const handleDeleteDoc = async () => {
        if (!window.confirm("Are you sure you want to delete this article? This will permanently remove it from Firestore.")) return;
        setSaving(true);
        setError(null);
        try {
            await deleteDoc(doc(db, "articles", projectId));
            onSave();
        } catch (err) {
            console.error("Error deleting article:", err);
            setError("Failed to delete article from Firestore.");
        } finally {
            setSaving(false);
        }
    };

    // Block Utilities
    const addBlock = (type: ArticleBlockType["type"]) => {
        let newBlock: ArticleBlockType;

        const base = {
            order: blocks.length,
            projectId: projectId,
            border: false
        };

        switch (type) {
            case "paragraph":
                newBlock = { ...base, type: "paragraph", content: "" };
                break;
            case "title":
                newBlock = { ...base, type: "title", content: "", level: 0 };
                break;
            case "image":
                newBlock = { ...base, type: "image", url: "", caption: "", size: "lg" };
                break;
            case "code":
                newBlock = { ...base, type: "code", language: "javascript", content: "" };
                break;
            case "list":
                newBlock = { ...base, type: "list", ordered: false, title: "", items: [""] };
                break;
            case "formula":
                newBlock = { ...base, type: "formula", content: "" };
                break;
            case "table":
                newBlock = { ...base, type: "table", headers: ["Header 1", "Header 2"], content: [["", ""]] };
                break;
            default:
                return;
        }

        setBlocks([...blocks, newBlock]);
    };

    const deleteBlock = (index: number) => {
        const updated = blocks.filter((_, idx) => idx !== index);
        setBlocks(updated);
    };

    const moveBlock = (index: number, direction: "up" | "down") => {
        if (direction === "up" && index === 0) return;
        if (direction === "down" && index === blocks.length - 1) return;

        const updated = [...blocks];
        const swapIdx = direction === "up" ? index - 1 : index + 1;
        const temp = updated[index];
        updated[index] = updated[swapIdx];
        updated[swapIdx] = temp;

        setBlocks(updated);
    };

    const updateBlockField = (index: number, key: string, value: unknown) => {
        setBlocks(prev => {
            const updated = [...prev];
            updated[index] = {
                ...updated[index],
                [key]: value
            } as ArticleBlockType;
            return updated;
        });
    };


    // List Block Helpers
    const updateListItem = (blockIndex: number, itemIndex: number, value: string) => {
        setBlocks(prev => {
            const updated = [...prev];
            const block = updated[blockIndex];
            if (block.type !== "list") return prev;

            const items = [...block.items];
            items[itemIndex] = value;
            updated[blockIndex] = { ...block, items } as ArticleBlockType;
            return updated;
        });
    };

    const addListItem = (blockIndex: number) => {
        setBlocks(prev => {
            const updated = [...prev];
            const block = updated[blockIndex];
            if (block.type !== "list") return prev;

            const items = [...block.items, ""];
            updated[blockIndex] = { ...block, items } as ArticleBlockType;
            return updated;
        });
    };

    const removeListItem = (blockIndex: number, itemIndex: number) => {
        setBlocks(prev => {
            const updated = [...prev];
            const block = updated[blockIndex];
            if (block.type !== "list") return prev;

            const items = block.items.filter((_, idx) => idx !== itemIndex);
            updated[blockIndex] = { ...block, items: items.length > 0 ? items : [""] } as ArticleBlockType;
            return updated;
        });
    };

    // Table Block Helpers
    const addTableCol = (blockIndex: number) => {
        setBlocks(prev => {
            const updated = [...prev];
            const block = updated[blockIndex];
            if (block.type !== "table") return prev;

            const headers = [...block.headers, `Header ${block.headers.length + 1}`];
            const content = block.content.map(row => [...row, ""]);
            updated[blockIndex] = { ...block, headers, content } as ArticleBlockType;
            return updated;
        });
    };

    const removeTableCol = (blockIndex: number) => {
        setBlocks(prev => {
            const updated = [...prev];
            const block = updated[blockIndex];
            if (block.type !== "table") return prev;
            if (block.headers.length <= 1) return prev;

            const headers = block.headers.slice(0, -1);
            const content = block.content.map(row => row.slice(0, -1));
            updated[blockIndex] = { ...block, headers, content } as ArticleBlockType;
            return updated;
        });
    };

    const addTableRow = (blockIndex: number) => {
        setBlocks(prev => {
            const updated = [...prev];
            const block = updated[blockIndex];
            if (block.type !== "table") return prev;

            const content = [...block.content, Array(block.headers.length).fill("")];
            updated[blockIndex] = { ...block, content } as ArticleBlockType;
            return updated;
        });
    };

    const removeTableRow = (blockIndex: number) => {
        setBlocks(prev => {
            const updated = [...prev];
            const block = updated[blockIndex];
            if (block.type !== "table") return prev;
            if (block.content.length <= 1) return prev;

            const content = block.content.slice(0, -1);
            updated[blockIndex] = { ...block, content } as ArticleBlockType;
            return updated;
        });
    };

    const updateTableCell = (blockIndex: number, rowIdx: number, colIdx: number, value: string) => {
        setBlocks(prev => {
            const updated = [...prev];
            const block = updated[blockIndex];
            if (block.type !== "table") return prev;

            const content = block.content.map((row, r) =>
                row.map((cell, c) => (r === rowIdx && c === colIdx ? value : cell))
            );
            updated[blockIndex] = { ...block, content } as ArticleBlockType;
            return updated;
        });
    };

    const updateTableHeader = (blockIndex: number, colIdx: number, value: string) => {
        setBlocks(prev => {
            const updated = [...prev];
            const block = updated[blockIndex];
            if (block.type !== "table") return prev;

            const headers = [...block.headers];
            headers[colIdx] = value;
            updated[blockIndex] = { ...block, headers } as ArticleBlockType;
            return updated;
        });
    };


    if (loading) {
        return (
            <div className="flex items-center gap-2 p-6 animate-pulse text-[var(--txt-subtitle-color)]">
                <RefreshCw size={18} className="animate-spin" />
                <span>Loading article editor workspace...</span>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 w-full">
            {/* Header / Meta controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[var(--border-color)] pb-4">
                <div>
                    <h3 className="text-xl font-bold text-[var(--txt-title-color)]">
                        {action === "edit" ? "Edit" : "Create"} Article for <span className="text-[var(--txt-highlight-color)]">{project?.title || projectId}</span>
                    </h3>
                    <div className="flex gap-4 text-xs text-[var(--txt-subtitle-color)] mt-1">
                        <span>Created: {createdAt || "—"}</span>
                        {lastUpdated && <span>Last Updated: {lastUpdated}</span>}
                        <span>Status: <strong className={isPublic ? "text-[var(--color-accent-solid)]" : "text-[var(--feedback-warning)]"}>{isPublic ? "Public" : "Draft"}</strong></span>
                        {publishDate && <span>Published: {publishDate}</span>}
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleSaveDoc}
                        disabled={saving}
                        className="px-4 py-2 bg-[var(--color-accent-solid)] hover:bg-[var(--color-accent-subtle)] text-[var(--bg-color)] rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <Save size={16} />
                        <span>{saving ? "Saving..." : "Save Draft"}</span>
                    </button>
                    {action === "edit" && (
                        <button
                            onClick={handleDeleteDoc}
                            disabled={saving}
                            className="px-4 py-2 border border-[var(--feedback-error)] text-[var(--feedback-error)] hover:bg-[var(--feedback-error)]/10 rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Article"
                        >
                            <Trash2 size={16} />
                            <span>Delete</span>
                        </button>
                    )}
                    <button
                        onClick={onCancel}
                        disabled={saving}
                        className="px-4 py-2 border border-[var(--border-color)] text-[var(--txt-body-color)] hover:bg-[var(--bg-secondary-color)] rounded font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
                    >
                        <X size={16} />
                        <span>Cancel</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 p-4 border border-[var(--feedback-error)] bg-[var(--bg-secondary-color)] rounded text-[var(--feedback-error)]">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {/* Split Screen Control Tab */}
            <div className="flex border-b border-[var(--border-color)] gap-2">
                <button
                    onClick={() => setPreviewTab("edit")}
                    className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${previewTab === "edit"
                        ? "border-[var(--txt-highlight-color)] text-[var(--txt-highlight-color)]"
                        : "border-transparent text-[var(--txt-subtitle-color)] hover:text-[var(--txt-feature-color)]"
                        }`}
                >
                    Editor
                </button>
                <button
                    onClick={() => setPreviewTab("preview")}
                    className={`px-4 py-2 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${previewTab === "preview"
                        ? "border-[var(--txt-highlight-color)] text-[var(--txt-highlight-color)]"
                        : "border-transparent text-[var(--txt-subtitle-color)] hover:text-[var(--txt-feature-color)]"
                        }`}
                >
                    Live Preview
                </button>
                <button
                    onClick={() => setPreviewTab("split")}
                    className={`hidden lg:block px-4 py-2 font-semibold text-sm border-b-2 transition-colors cursor-pointer ${previewTab === "split"
                        ? "border-[var(--txt-highlight-color)] text-[var(--txt-highlight-color)]"
                        : "border-transparent text-[var(--txt-subtitle-color)] hover:text-[var(--txt-feature-color)]"
                        }`}
                >
                    Split View
                </button>
            </div>

            {/* Editor Workspace Panels */}
            <div className={`grid w-full gap-8 ${previewTab === "split" ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>

                {/* Left panel: Form Blocks Builder */}
                {(previewTab === "edit" || previewTab === "split") && (
                    <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-4 pr-2">
                            {blocks.map((block, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-4 shadow-sm"
                                >
                                    {/* Block Control Header */}
                                    <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 text-xs">
                                        <div className="flex items-center gap-2">
                                            <span className="bg-[var(--bg-secondary-color)] px-2 py-0.5 rounded font-bold text-[var(--txt-feature-color)]">
                                                #{idx + 1}
                                            </span>
                                            <span className="font-bold uppercase text-[var(--txt-subtitle-color)] tracking-wide">
                                                {block.type}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {/* Border Toggle */}
                                            <label className="flex items-center gap-1 text-[var(--txt-subtitle-color)] font-medium cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={block.border}
                                                    onChange={(e) => updateBlockField(idx, "border", e.target.checked)}
                                                    className="w-3.5 h-3.5 accent-[var(--txt-highlight-color)]"
                                                />
                                                <span>Border</span>
                                            </label>

                                            <span className="h-4 w-[1px] bg-[var(--border-color)] mx-1"></span>

                                            {/* Reorder Up */}
                                            <button
                                                onClick={() => moveBlock(idx, "up")}
                                                disabled={idx === 0}
                                                className="p-1 hover:bg-[var(--bg-secondary-color)] rounded text-[var(--txt-subtitle-color)] disabled:opacity-30 cursor-pointer"
                                                title="Move Up"
                                            >
                                                <ChevronUp size={14} />
                                            </button>

                                            {/* Reorder Down */}
                                            <button
                                                onClick={() => moveBlock(idx, "down")}
                                                disabled={idx === blocks.length - 1}
                                                className="p-1 hover:bg-[var(--bg-secondary-color)] rounded text-[var(--txt-subtitle-color)] disabled:opacity-30 cursor-pointer"
                                                title="Move Down"
                                            >
                                                <ChevronDown size={14} />
                                            </button>

                                            <span className="h-4 w-[1px] bg-[var(--border-color)] mx-1"></span>

                                            {/* Delete Block */}
                                            <button
                                                onClick={() => deleteBlock(idx)}
                                                className="p-1 text-[var(--feedback-error)] hover:bg-[var(--feedback-error)]/10 rounded cursor-pointer"
                                                title="Delete Block"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Block Type Fields */}
                                    <div className="text-sm">
                                        {block.type === "paragraph" && (
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Content (Markdown supported)</label>
                                                <textarea
                                                    value={block.content}
                                                    onChange={(e) => updateBlockField(idx, "content", e.target.value)}
                                                    placeholder="Type paragraph text..."
                                                    className="p-2.5 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] w-full min-h-[100px] focus:outline-none focus:border-[var(--border-focus)] font-serif text-base"
                                                />
                                            </div>
                                        )}

                                        {block.type === "title" && (
                                            <div className="grid grid-cols-4 gap-3">
                                                <div className="col-span-1 flex flex-col gap-1">
                                                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Level</label>
                                                    <select
                                                        value={block.level === 0 ? 2 : block.level === 1 ? 3 : block.level === 2 ? 4 : 2}
                                                        onChange={(e) => {
                                                            const val = Number(e.target.value);
                                                            const mappedLevel = val === 2 ? 0 : val === 3 ? 1 : val === 4 ? 2 : 0;
                                                            updateBlockField(idx, "level", mappedLevel);
                                                        }}
                                                        className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer"
                                                    >
                                                        <option value={2}>H2</option>
                                                        <option value={3}>H3</option>
                                                        <option value={4}>H4</option>
                                                    </select>
                                                </div>
                                                <div className="col-span-3 flex flex-col gap-1">
                                                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Title Text</label>
                                                    <input
                                                        type="text"
                                                        value={block.content}
                                                        onChange={(e) => updateBlockField(idx, "content", e.target.value)}
                                                        placeholder="Enter heading title..."
                                                        className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)] font-semibold"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {block.type === "image" && (
                                            <div className="flex flex-col gap-3">
                                                <div className="grid grid-cols-4 gap-3">
                                                    <div className="col-span-3 flex flex-col gap-1">
                                                        <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Image Path or URL</label>
                                                        <input
                                                            type="text"
                                                            value={block.url}
                                                            onChange={(e) => updateBlockField(idx, "url", e.target.value)}
                                                            placeholder="e.g. /article_img/my-photo.jpg"
                                                            className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                                                        />
                                                    </div>
                                                    <div className="col-span-1 flex flex-col gap-1">
                                                        <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Size</label>
                                                        <select
                                                            value={block.size || "lg"}
                                                            onChange={(e) => updateBlockField(idx, "size", e.target.value)}
                                                            className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer"
                                                        >
                                                            <option value="sm">Small</option>
                                                            <option value="md">Medium</option>
                                                            <option value="lg">Large</option>
                                                            <option value="xl">X-Large</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Caption (Optional)</label>
                                                    <input
                                                        type="text"
                                                        value={block.caption || ""}
                                                        onChange={(e) => updateBlockField(idx, "caption", e.target.value)}
                                                        placeholder="Enter image caption..."
                                                        className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {block.type === "code" && (
                                            <div className="flex flex-col gap-3">
                                                <div className="flex flex-col gap-1 w-48">
                                                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Language</label>
                                                    <input
                                                        type="text"
                                                        value={block.language}
                                                        onChange={(e) => updateBlockField(idx, "language", e.target.value)}
                                                        placeholder="e.g. typescript, python, css"
                                                        className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                                                    />
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Code Content</label>
                                                    <textarea
                                                        value={block.content}
                                                        onChange={(e) => updateBlockField(idx, "content", e.target.value)}
                                                        placeholder="Paste your source code here..."
                                                        className="p-2.5 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] w-full min-h-[120px] focus:outline-none focus:border-[var(--border-focus)] font-mono text-sm"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {block.type === "list" && (
                                            <div className="flex flex-col gap-3">
                                                <div className="grid grid-cols-4 gap-3">
                                                    <div className="col-span-3 flex flex-col gap-1">
                                                        <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">List Header/Title (Optional)</label>
                                                        <input
                                                            type="text"
                                                            value={block.title || ""}
                                                            onChange={(e) => updateBlockField(idx, "title", e.target.value)}
                                                            placeholder="e.g. Key Features:"
                                                            className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                                                        />
                                                    </div>
                                                    <div className="col-span-1 flex flex-col justify-center items-center gap-1">
                                                        <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Ordered?</label>
                                                        <input
                                                            type="checkbox"
                                                            checked={block.ordered}
                                                            onChange={(e) => updateBlockField(idx, "ordered", e.target.checked)}
                                                            className="w-5 h-5 accent-[var(--txt-highlight-color)] cursor-pointer mt-1"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex flex-col gap-2">
                                                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">List Items</label>
                                                    <div className="flex flex-col gap-2">
                                                        {block.items.map((item, itemIdx) => (
                                                            <div key={itemIdx} className="flex gap-2 items-center">
                                                                <span className="text-xs font-semibold text-[var(--txt-subtitle-color)] w-6 text-right">
                                                                    {block.ordered ? `${itemIdx + 1}.` : "•"}
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    value={item}
                                                                    onChange={(e) => updateListItem(idx, itemIdx, e.target.value)}
                                                                    placeholder={`List item ${itemIdx + 1}`}
                                                                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] flex-1 focus:outline-none focus:border-[var(--border-focus)]"
                                                                />
                                                                <button
                                                                    onClick={() => removeListItem(idx, itemIdx)}
                                                                    className="p-2 text-[var(--feedback-error)] hover:bg-[var(--feedback-error)]/10 rounded cursor-pointer"
                                                                    title="Remove Item"
                                                                >
                                                                    <X size={14} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={() => addListItem(idx)}
                                                        className="mt-2 text-xs font-bold text-[var(--color-accent-solid)] hover:text-[var(--color-accent-subtle)] flex items-center gap-1 cursor-pointer w-fit"
                                                    >
                                                        <Plus size={12} />
                                                        <span>Add List Item</span>
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {block.type === "formula" && (
                                            <div className="flex flex-col gap-1">
                                                <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">LaTeX Equation Content</label>
                                                <textarea
                                                    value={block.content}
                                                    onChange={(e) => updateBlockField(idx, "content", e.target.value)}
                                                    placeholder="e.g. \\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}"
                                                    className="p-2.5 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] w-full min-h-[80px] focus:outline-none focus:border-[var(--border-focus)] font-mono"
                                                />
                                            </div>
                                        )}

                                        {block.type === "table" && (
                                            <div className="flex flex-col gap-3">
                                                {/* Columns Actions */}
                                                <div className="flex items-center gap-4 text-xs">
                                                    <span className="font-semibold text-[var(--txt-subtitle-color)]">Table Columns ({block.headers.length}):</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => addTableCol(idx)}
                                                        className="text-[var(--color-accent-solid)] font-bold hover:underline cursor-pointer"
                                                    >
                                                        + Add Column
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTableCol(idx)}
                                                        className="text-[var(--feedback-error)] font-bold hover:underline cursor-pointer disabled:opacity-30"
                                                        disabled={block.headers.length <= 1}
                                                    >
                                                        - Remove Column
                                                    </button>
                                                </div>

                                                <div className="overflow-x-auto max-w-full border border-[var(--border-color)] rounded p-2 bg-[var(--bg-color)]">
                                                    <table className="min-w-full table-auto text-left text-xs border-collapse">
                                                        <thead>
                                                            <tr>
                                                                {block.headers.map((h, colIdx) => (
                                                                    <th key={colIdx} className="p-1 min-w-[100px]">
                                                                        <input
                                                                            type="text"
                                                                            value={h}
                                                                            onChange={(e) => updateTableHeader(idx, colIdx, e.target.value)}
                                                                            className="p-1 w-full border border-[var(--border-color)] rounded bg-[var(--bg-card)] text-[var(--txt-feature-color)] font-bold focus:outline-none focus:border-[var(--border-focus)]"
                                                                        />
                                                                    </th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {block.content.map((row, rowIdx) => (
                                                                <tr key={rowIdx}>
                                                                    {row.map((cell, colIdx) => (
                                                                        <td key={colIdx} className="p-1">
                                                                            <input
                                                                                type="text"
                                                                                value={cell}
                                                                                onChange={(e) => updateTableCell(idx, rowIdx, colIdx, e.target.value)}
                                                                                className="p-1 w-full border border-[var(--border-color)] rounded bg-[var(--bg-card)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                                                                            />
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>

                                                {/* Row Actions */}
                                                <div className="flex items-center gap-4 text-xs">
                                                    <span className="font-semibold text-[var(--txt-subtitle-color)]">Table Rows ({block.content.length}):</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => addTableRow(idx)}
                                                        className="text-[var(--color-accent-solid)] font-bold hover:underline cursor-pointer"
                                                    >
                                                        + Add Row
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeTableRow(idx)}
                                                        className="text-[var(--feedback-error)] font-bold hover:underline cursor-pointer disabled:opacity-30"
                                                        disabled={block.content.length <= 1}
                                                    >
                                                        - Remove Row
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {blocks.length === 0 && (
                                <div className="border border-dashed border-[var(--border-color)] p-8 text-center rounded text-[var(--txt-subtitle-color)] bg-[var(--bg-card)]">
                                    This article has no content blocks yet. Use the buttons below to add paragraphs, titles, images, tables, etc.
                                </div>
                            )}
                        </div>

                        {/* Add Block Options Toolbar */}
                        <div className="bg-[var(--bg-secondary-color)] p-4 rounded-lg border border-[var(--border-color)]">
                            <span className="text-xs font-bold text-[var(--txt-subtitle-color)] block mb-3 uppercase tracking-wider">
                                Add Content Block
                            </span>
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => addBlock("paragraph")}
                                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                                >
                                    <Type size={12} />
                                    <span>Paragraph</span>
                                </button>
                                <button
                                    onClick={() => addBlock("title")}
                                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                                >
                                    <ALargeSmall size={12} />
                                    <span>Heading</span>
                                </button>
                                <button
                                    onClick={() => addBlock("image")}
                                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                                >
                                    <Image size={12} />
                                    <span>Image</span>
                                </button>
                                <button
                                    onClick={() => addBlock("code")}
                                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                                >
                                    <Code size={12} />
                                    <span>Code Block</span>
                                </button>
                                <button
                                    onClick={() => addBlock("list")}
                                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                                >
                                    <List size={12} />
                                    <span>List</span>
                                </button>
                                <button
                                    onClick={() => addBlock("formula")}
                                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                                >
                                    <SquareFunction size={12} />
                                    <span>LaTeX Formula</span>
                                </button>
                                <button
                                    onClick={() => addBlock("table")}
                                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                                >
                                    <Grid3X3 size={12} />
                                    <span>Table</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Right panel: Website Live Preview Rendering */}
                {(previewTab === "preview" || previewTab === "split") && (
                    <div className="flex flex-col gap-4">
                        <div className="border border-[var(--border-color)] rounded-lg p-6 bg-[var(--bg-card)] shadow-inner min-h-[300px]">
                            <div className="flex flex-col gap-3 w-full max-w-[800px] mx-auto text-left">
                                <div className="mb-4 title text-4xl text-[var(--txt-body-color)] font-medium">
                                    {project?.title || "Project Title"}
                                </div>
                                <div className="text-sm text-[var(--txt-subtitle-color)] mb-8">
                                    {publishDate ? `Published: ${publishDate}` : "Draft Status"}
                                </div>
                                {blocks.map((block, idx) => (
                                    <ArticleBlockRenderer key={idx} block={block} />
                                ))}
                                {blocks.length === 0 && (
                                    <p className="text-center italic text-[var(--txt-subtitle-color)] py-12">
                                        Rendered preview will appear here in real-time...
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
