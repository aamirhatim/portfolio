import { useEffect, useState, useCallback } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib";
import { ProjectType, ArticleType } from "../../data/datatypes";
import { Pencil, Plus, Trash2, AlertCircle, RefreshCw, BookCheck, BookDashed } from "lucide-react";
import ArticleEditor from "./ArticleEditor";
import { doc, getFirestore, setDoc, deleteDoc } from "firebase/firestore";
import ArticleStatusBadge, { ArticleStatus } from "../molecules/article-manager/ArticleStatusBadge";



export default function ArticleManager() {
    const firebaseApp = useFirebaseAppContext();
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [articlesMap, setArticlesMap] = useState<Record<string, ArticleType>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeEditId, setActiveEditId] = useState<string | null>(null);
    const [editorPlaceholderAction, setEditorPlaceholderAction] = useState<string | null>(null);

    const fetchData = useCallback(async (active: boolean = true) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch all projects
            const projectDocs = await getDocumentsFromCollection(firebaseApp, "projects");
            if (!active) return;
            
            if (projectDocs) {
                const parsedProjects = projectDocs.map(doc => ({
                    id: doc.id,
                    ...doc.data
                })) as ProjectType[];
                // Sort by publishDate descending
                parsedProjects.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
                setProjects(parsedProjects);
            }

            // 2. Fetch all articles
            const articleDocs = await getDocumentsFromCollection(firebaseApp, "articles");
            if (!active) return;

            if (articleDocs) {
                const newMap: Record<string, ArticleType> = {};
                articleDocs.forEach(doc => {
                    newMap[doc.id] = doc.data as ArticleType;
                });
                setArticlesMap(newMap);
            }
        } catch (err) {
            console.error("Error fetching article management data:", err);
            if (active) setError("Failed to load articles. Please check your network connection or permissions.");
        } finally {
            if (active) setLoading(false);
        }
    }, [firebaseApp]);

    useEffect(() => {
        let active = true;
        fetchData(active);
        return () => {
            active = false;
        };
    }, [fetchData]);

    const getArticleStatus = (projectId: string): ArticleStatus => {
        const firestoreArticle = articlesMap[projectId];
        if (firestoreArticle) {
            return firestoreArticle.public ? "published" : "unpublished";
        }

        return "none";
    };

    const handleActionClick = (projectId: string, action: string) => {
        setActiveEditId(projectId);
        setEditorPlaceholderAction(action);
    };

    const handlePublishToggle = async (projectId: string, currentPublic: boolean) => {
        const art = articlesMap[projectId];
        if (!art) return;

        setLoading(true);
        setError(null);
        try {
            const db = getFirestore(firebaseApp);
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

            const updatedArticle: ArticleType = {
                ...art,
                public: !currentPublic,
                publishDate: !currentPublic ? today : art.publishDate,
                lastUpdated: today
            };

            await setDoc(doc(db, "articles", projectId), updatedArticle);
            await fetchData();
        } catch (err) {
            console.error("Error toggling publish status:", err);
            setError("Failed to update publish status. Check network or rules.");
            setLoading(false);
        }
    };

    const handleDeleteClick = async (projectId: string) => {
        if (!window.confirm(`Are you sure you want to delete the article for "${projectId}" from Firestore?`)) return;
        setLoading(true);
        setError(null);
        try {
            const db = getFirestore(firebaseApp);
            await deleteDoc(doc(db, "articles", projectId));
            await fetchData();
        } catch (err) {
            console.error("Error deleting article:", err);
            setError("Failed to delete article. Check database security rules.");
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center gap-2 p-6 animate-pulse text-[var(--txt-subtitle-color)]">
                <RefreshCw size={18} className="animate-spin" />
                <span>Loading article statuses...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center gap-3 p-4 border border-[var(--feedback-error)] bg-[var(--bg-secondary-color)] rounded-lg text-[var(--feedback-error)]">
                <AlertCircle size={20} />
                <span className="font-medium">{error}</span>
                <button onClick={() => fetchData()} className="ml-auto underline hover:text-[var(--txt-highlight-color)] cursor-pointer">Retry</button>
            </div>
        );
    }

    if (editorPlaceholderAction && activeEditId) {
        return (
            <ArticleEditor
                projectId={activeEditId}
                action={editorPlaceholderAction as "create-new" | "edit"}
                onCancel={() => {
                    setActiveEditId(null);
                    setEditorPlaceholderAction(null);
                }}
                onSave={() => {
                    setActiveEditId(null);
                    setEditorPlaceholderAction(null);
                    fetchData();
                }}
            />
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-start">
                <button
                    onClick={() => fetchData()}
                    className="p-2 border border-[var(--border-color)] rounded hover:bg-[var(--bg-secondary-color)] text-[var(--txt-subtitle-color)] hover:text-[var(--txt-feature-color)] transition-colors cursor-pointer"
                    title="Refresh Data"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            <div className="overflow-x-auto border border-[var(--border-color)] rounded-lg">
                <table className="w-full text-left text-sm text-[var(--txt-body-color)] border-collapse">
                    <thead>
                        <tr className="bg-[var(--bg-secondary-color)] border-b border-[var(--border-color)]">
                            <th className="py-3 px-4 font-bold text-[var(--txt-feature-color)]">Project</th>
                            <th className="py-3 px-4 font-bold text-[var(--txt-feature-color)]">Status</th>
                            <th className="py-3 px-4 font-bold text-[var(--txt-feature-color)]">Publish Date</th>
                            <th className="py-3 px-4 font-bold text-[var(--txt-feature-color)]">Last Updated</th>
                            <th className="py-3 px-4 font-bold text-[var(--txt-feature-color)] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((proj) => {
                            const status = getArticleStatus(proj.id);
                            const art = articlesMap[proj.id];

                            return (
                                <tr key={proj.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-interactive-hover)]/40 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-[var(--txt-feature-color)]">
                                        <div className="font-semibold">{proj.title}</div>
                                        <div className="text-xs text-[var(--txt-subtitle-color)] mt-0.5">{proj.id}</div>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <ArticleStatusBadge status={status} />
                                    </td>
                                    <td className="py-3.5 px-4 text-[var(--txt-subtitle-color)] whitespace-nowrap">
                                        {art?.publishDate || "—"}
                                    </td>
                                    <td className="py-3.5 px-4 text-[var(--txt-subtitle-color)] whitespace-nowrap">
                                        {art?.lastUpdated || "—"}
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {status === "published" || status === "unpublished" ? (
                                                <>
                                                    <button
                                                        onClick={() => handlePublishToggle(proj.id, art?.public)}
                                                        className={`p-1.5 rounded transition-colors cursor-pointer ${art?.public
                                                                ? "text-[var(--color-accent-solid)] hover:bg-[var(--color-accent-bg-subtle)]"
                                                                : "text-[var(--feedback-warning)] hover:bg-[var(--bg-secondary-color)]"
                                                            }`}
                                                        title={art?.public ? "Unpublish Article" : "Publish Article"}
                                                    >
                                                        {art?.public ? <BookDashed size={15} /> : <BookCheck size={15} />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleActionClick(proj.id, "edit")}
                                                        className="p-1.5 text-[var(--txt-subtitle-color)] hover:bg-[var(--txt-highlight-color)] hover:text-[var(--bg-color)] rounded transition-colors cursor-pointer"
                                                        title="Edit Article"
                                                    >
                                                        <Pencil size={15} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteClick(proj.id)}
                                                        className="p-1.5 text-[var(--txt-subtitle-color)] hover:bg-[var(--feedback-error)] hover:text-[var(--bg-color)] rounded transition-colors cursor-pointer"
                                                        title="Delete Article"
                                                    >
                                                        <Trash2 size={15} />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => handleActionClick(proj.id, "create-new")}
                                                    className="p-1.5 text-[var(--txt-subtitle-color)] hover:bg-[var(--txt-highlight-color)] hover:text-[var(--bg-color)] rounded transition-colors cursor-pointer"
                                                    title="Create Article"
                                                >
                                                    <Plus size={15} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center p-8 text-[var(--txt-subtitle-color)]">
                                    No projects found in Firestore. Add some under the "Projects" tab first.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
