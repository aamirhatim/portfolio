
import { ArticleBlockType, ProjectType } from "../../../data/datatypes";
import ArticleBlockRenderer from "../../atoms/ArticleBlockRenderer";

interface ArticlePreviewProps {
    project: ProjectType | null;
    blocks: ArticleBlockType[];
    publishDate?: string;
}

export default function ArticlePreview({ project, blocks, publishDate }: ArticlePreviewProps) {
    return (
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
    );
}
