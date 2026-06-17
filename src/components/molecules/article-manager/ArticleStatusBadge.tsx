

export type ArticleStatus = "published" | "unpublished" | "none";

interface ArticleStatusBadgeProps {
    status: ArticleStatus;
}

export default function ArticleStatusBadge({ status }: ArticleStatusBadgeProps) {
    if (status === "published") {
        return (
            <span className="bg-[var(--color-accent-bg-subtle)] text-[var(--color-accent-solid)] border border-[var(--color-accent-bg-strong)] px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                Published
            </span>
        );
    }
    
    if (status === "unpublished") {
        return (
            <span className="bg-[var(--bg-color)] text-[var(--feedback-warning)] border border-[var(--border-color)] px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
                Unpublished
            </span>
        );
    }
    


    return (
        <span className="bg-[var(--bg-color)] text-[var(--txt-subtitle-color)] border border-[var(--border-color)] px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap">
            No Article
        </span>
    );
}
