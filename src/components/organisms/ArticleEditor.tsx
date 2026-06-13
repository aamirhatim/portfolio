import { useEffect, useState } from "react";
import { doc, getDoc, getFirestore, setDoc, deleteDoc } from "firebase/firestore";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentFromId } from "../../lib/firestoreLib";
import { ProjectType, ArticleType, ArticleBlockType } from "../../data/datatypes";
import { Save, X, RefreshCw, AlertCircle, Trash2 } from "lucide-react";

import ArticleBlockRenderer from "../atoms/ArticleBlockRenderer";
import BlockHeaderControls from "../molecules/editor-fields/BlockHeaderControls";
import BlockToolbar from "../molecules/editor-fields/BlockToolbar";
import ParagraphEditor from "../molecules/editor-fields/ParagraphEditor";
import TitleEditor from "../molecules/editor-fields/TitleEditor";
import ImageEditor from "../molecules/editor-fields/ImageEditor";
import CodeEditor from "../molecules/editor-fields/CodeEditor";
import ListEditor from "../molecules/editor-fields/ListEditor";
import FormulaEditor from "../molecules/editor-fields/FormulaEditor";
import TableEditor from "../molecules/editor-fields/TableEditor";

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

    const updateBlock = (index: number, updatedBlock: ArticleBlockType) => {
        setBlocks(prev => {
            const updated = [...prev];
            updated[index] = updatedBlock;
            return updated;
        });
    };

    const updateBlockBorder = (index: number, border: boolean) => {
        setBlocks(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], border };
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
                                    <BlockHeaderControls
                                        idx={idx}
                                        type={block.type}
                                        border={block.border}
                                        isFirst={idx === 0}
                                        isLast={idx === blocks.length - 1}
                                        onBorderChange={(checked) => updateBlockBorder(idx, checked)}
                                        onMoveUp={() => moveBlock(idx, "up")}
                                        onMoveDown={() => moveBlock(idx, "down")}
                                        onDelete={() => deleteBlock(idx)}
                                    />

                                    <div className="text-sm">
                                        {block.type === "paragraph" && (
                                            <ParagraphEditor
                                                block={block}
                                                onChange={(updated) => updateBlock(idx, updated)}
                                            />
                                        )}

                                        {block.type === "title" && (
                                            <TitleEditor
                                                block={block}
                                                onChange={(updated) => updateBlock(idx, updated)}
                                            />
                                        )}

                                        {block.type === "image" && (
                                            <ImageEditor
                                                block={block}
                                                onChange={(updated) => updateBlock(idx, updated)}
                                            />
                                        )}

                                        {block.type === "code" && (
                                            <CodeEditor
                                                block={block}
                                                onChange={(updated) => updateBlock(idx, updated)}
                                            />
                                        )}

                                        {block.type === "list" && (
                                            <ListEditor
                                                block={block}
                                                onChange={(updated) => updateBlock(idx, updated)}
                                            />
                                        )}

                                        {block.type === "formula" && (
                                            <FormulaEditor
                                                block={block}
                                                onChange={(updated) => updateBlock(idx, updated)}
                                            />
                                        )}

                                        {block.type === "table" && (
                                            <TableEditor
                                                block={block}
                                                onChange={(updated) => updateBlock(idx, updated)}
                                            />
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
                        <BlockToolbar onAddBlock={addBlock} />
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
