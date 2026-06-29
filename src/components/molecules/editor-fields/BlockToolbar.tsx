import {
    Type,
    ALargeSmall,
    Image as ImageIcon,
    Code,
    List,
    SquareFunction,
    Grid3X3
} from "lucide-react";
import { ArticleBlockType } from "../../../data/datatypes";

type BlockToolbarProps = {
    onAddBlock: (type: ArticleBlockType["type"]) => void;
};

export default function BlockToolbar({ onAddBlock }: BlockToolbarProps) {
    return (
        <div className="bg-[var(--bg-secondary-color)] p-2 rounded-lg border border-[var(--border-color)] flex items-center gap-1.5 w-fit shadow-sm">
            <button
                onClick={() => onAddBlock("paragraph")}
                className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-[var(--txt-body-color)] hover:text-[var(--txt-highlight-color)] transition-colors cursor-pointer"
                title="Add Paragraph"
            >
                <Type size={16} />
            </button>
            <button
                onClick={() => onAddBlock("title")}
                className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-[var(--txt-body-color)] hover:text-[var(--txt-highlight-color)] transition-colors cursor-pointer"
                title="Add Heading"
            >
                <ALargeSmall size={16} />
            </button>
            <button
                onClick={() => onAddBlock("image")}
                className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-[var(--txt-body-color)] hover:text-[var(--txt-highlight-color)] transition-colors cursor-pointer"
                title="Add Image"
            >
                <ImageIcon size={16} />
            </button>
            <button
                onClick={() => onAddBlock("code")}
                className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-[var(--txt-body-color)] hover:text-[var(--txt-highlight-color)] transition-colors cursor-pointer"
                title="Add Code Block"
            >
                <Code size={16} />
            </button>
            <button
                onClick={() => onAddBlock("list")}
                className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-[var(--txt-body-color)] hover:text-[var(--txt-highlight-color)] transition-colors cursor-pointer"
                title="Add List"
            >
                <List size={16} />
            </button>
            <button
                onClick={() => onAddBlock("formula")}
                className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-[var(--txt-body-color)] hover:text-[var(--txt-highlight-color)] transition-colors cursor-pointer"
                title="Add LaTeX Formula"
            >
                <SquareFunction size={16} />
            </button>
            <button
                onClick={() => onAddBlock("table")}
                className="p-2 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-[var(--txt-body-color)] hover:text-[var(--txt-highlight-color)] transition-colors cursor-pointer"
                title="Add Table"
            >
                <Grid3X3 size={16} />
            </button>
        </div>
    );
}
