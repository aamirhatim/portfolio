import { useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib";
import { ProjectType, ArticleType } from "../../data/datatypes";
import { Pencil, Plus, Trash2, BookOpen, AlertCircle, RefreshCw } from "lucide-react";

// Get map of local articles to check for fallback availability
const articleModules = import.meta.glob("/src/data/articles/*.json");

export default function ArticleManager() {
    const firebaseApp = useFirebaseAppContext();
    const [projects, setProjects] = useState<ProjectType[]>([]);
    const [articlesMap, setArticlesMap] = useState<Record<string, ArticleType>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeEditId, setActiveEditId] = useState<string | null>(null);
    const [editorPlaceholderAction, setEditorPlaceholderAction] = useState<string | null>(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch all projects
            const projectDocs = await getDocumentsFromCollection(firebaseApp, "projects");
            if (projectDocs) {
                const parsedProjects = projectDocs.map(doc => ({
                    id: doc.id,
                    ...doc.data
                })) as ProjectType[];
                // Sort by publishDate descending or title
                parsedProjects.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
                setProjects(parsedProjects);
            }

            // 2. Fetch all articles
            const articleDocs = await getDocumentsFromCollection(firebaseApp, "articles");
            if (articleDocs) {
                const newMap: Record<string, ArticleType> = {};
                articleDocs.forEach(doc => {
                    newMap[doc.id] = doc.data as ArticleType;
                });
                setArticlesMap(newMap);
            }
        } catch (err) {
            console.error("Error fetching article management data:", err);
            setError("Failed to load articles. Please check your network connection or permissions.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let active = true;

        const load = async () => {
            try {
                const projectDocs = await getDocumentsFromCollection(firebaseApp, "projects");
                const articleDocs = await getDocumentsFromCollection(firebaseApp, "articles");

                if (!active) return;

                if (projectDocs) {
                    const parsedProjects = projectDocs.map(doc => ({
                        id: doc.id,
                        ...doc.data
                    })) as ProjectType[];
                    parsedProjects.sort((a, b) => b.publishDate.localeCompare(a.publishDate));
                    setProjects(parsedProjects);
                }

                if (articleDocs) {
                    const newMap: Record<string, ArticleType> = {};
                    articleDocs.forEach(doc => {
                        newMap[doc.id] = doc.data as ArticleType;
                    });
                    setArticlesMap(newMap);
                }
            } catch (err) {
                console.error("Error loading article manager:", err);
                if (active) setError("Failed to load articles and projects.");
            } finally {
                if (active) setLoading(false);
            }
        };

        load();

        return () => {
            active = false;
        };
    }, [firebaseApp]);

    const getArticleStatus = (projectId: string) => {
        const firestoreArticle = articlesMap[projectId];
        if (firestoreArticle) {
            return firestoreArticle.public ? "published-public" : "published-private";
        }

        const localPath = `/src/data/articles/${projectId}.json`;
        if (localPath in articleModules) {
            return "local-fallback";
        }

        return "none";
    };

    const handleActionClick = (projectId: string, action: string) => {
        setActiveEditId(projectId);
        setEditorPlaceholderAction(action);
    };

    const handleDeleteClick = (projectId: string) => {
        if (window.confirm(`Are you sure you want to delete the article for "${projectId}" from Firestore?`)) {
            alert(`Placeholder: Deleting Firestore article for project: ${projectId}. (This will be fully implemented in Phase 2)`);
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
                <button onClick={fetchData} className="ml-auto underline hover:text-[var(--txt-highlight-color)] cursor-pointer">Retry</button>
            </div>
        );
    }

    if (editorPlaceholderAction && activeEditId) {
        const project = projects.find(p => p.id === activeEditId);
        return (
            <div className="bg-[var(--bg-secondary-color)] p-6 rounded-lg border border-[var(--border-color)]">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-[var(--txt-title-color)] capitalize">
                        {editorPlaceholderAction.replace("-", " ")} Article
                    </h3>
                    <button 
                        onClick={() => {
                            setActiveEditId(null);
                            setEditorPlaceholderAction(null);
                        }} 
                        className="px-4 py-2 border border-[var(--border-color)] rounded hover:bg-[var(--bg-color)] text-[var(--txt-body-color)] transition-colors cursor-pointer"
                    >
                        Back to List
                    </button>
                </div>
                <div className="border border-dashed border-[var(--border-color)] p-12 text-center rounded bg-[var(--bg-color)]">
                    <BookOpen size={48} className="mx-auto mb-4 text-[var(--txt-subtitle-color)] opacity-60" />
                    <h4 className="text-lg font-bold mb-2 text-[var(--txt-feature-color)]">
                        Editor UI Placeholder (Phase 2)
                    </h4>
                    <p className="text-sm text-[var(--txt-subtitle-color)] max-w-md mx-auto">
                        This view will house the block-based editor UI for project **"{project?.title || activeEditId}"**.
                        You will be able to customize blocks, set dates, toggle the public access flag, and save the content directly to Firestore.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-start">
                <button
                    onClick={fetchData}
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
                            <th className="py-3 px-4 font-bold text-[var(--txt-feature-color)] text-center">Blocks</th>
                            <th className="py-3 px-4 font-bold text-[var(--txt-feature-color)] text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((proj) => {
                            const status = getArticleStatus(proj.id);
                            const art = articlesMap[proj.id];

                            // Determine status badge layout
                            let statusBadge = (
                                <span className="bg-[var(--bg-color)] text-[var(--txt-subtitle-color)] border border-[var(--border-color)] px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                                    No Article
                                </span>
                            );

                            if (status === "published-public") {
                                statusBadge = (
                                    <span className="bg-[var(--color-accent-bg-subtle)] text-[var(--color-accent-solid)] border border-[var(--color-accent-bg-strong)] px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                                        Published (Public)
                                    </span>
                                );
                            } else if (status === "published-private") {
                                statusBadge = (
                                    <span className="bg-[var(--bg-color)] text-[var(--feedback-warning)] border border-[var(--border-color)] px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                                        Published (Private)
                                    </span>
                                );
                            } else if (status === "local-fallback") {
                                statusBadge = (
                                    <span className="bg-[var(--bg-color)] text-[var(--txt-subtitle-color)] border border-[var(--border-color)] px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                                        Local Fallback
                                    </span>
                                );
                            }

                            return (
                                <tr key={proj.id} className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-interactive-hover)]/40 transition-colors">
                                    <td className="py-3.5 px-4 font-medium text-[var(--txt-feature-color)]">
                                        <div className="font-semibold">{proj.title}</div>
                                        <div className="text-xs text-[var(--txt-subtitle-color)] mt-0.5">{proj.id}</div>
                                    </td>
                                    <td className="py-3.5 px-4">{statusBadge}</td>
                                    <td className="py-3.5 px-4 text-[var(--txt-subtitle-color)] whitespace-nowrap">
                                        {art?.publishDate || (status === "local-fallback" ? "Codebase static" : "—")}
                                    </td>
                                    <td className="py-3.5 px-4 text-[var(--txt-subtitle-color)] whitespace-nowrap">
                                        {art?.lastUpdated || "—"}
                                    </td>
                                    <td className="py-3.5 px-4 text-center text-[var(--txt-feature-color)] font-medium">
                                        {art?.blocks ? art.blocks.length : (status === "local-fallback" ? "Local static" : "—")}
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {status.startsWith("published") ? (
                                                <>
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
                                                    onClick={() => handleActionClick(proj.id, status === "local-fallback" ? "import-local" : "create-new")}
                                                    className="p-1.5 bg-[var(--txt-title-color)] text-[var(--bg-color)] rounded hover:opacity-90 transition-opacity flex items-center gap-1 text-xs font-semibold px-2 cursor-pointer"
                                                    title="Create Article"
                                                >
                                                    <Plus size={13} />
                                                    <span>Create</span>
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        {projects.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center p-8 text-[var(--txt-subtitle-color)]">
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
