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
        <div className="bg-[var(--bg-secondary-color)] p-4 rounded-lg border border-[var(--border-color)]">
            <span className="text-xs font-bold text-[var(--txt-subtitle-color)] block mb-3 uppercase tracking-wider">
                Add Content Block
            </span>
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onAddBlock("paragraph")}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                >
                    <Type size={12} />
                    <span>Paragraph</span>
                </button>
                <button
                    onClick={() => onAddBlock("title")}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                >
                    <ALargeSmall size={12} />
                    <span>Heading</span>
                </button>
                <button
                    onClick={() => onAddBlock("image")}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                >
                    <ImageIcon size={12} />
                    <span>Image</span>
                </button>
                <button
                    onClick={() => onAddBlock("code")}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                >
                    <Code size={12} />
                    <span>Code Block</span>
                </button>
                <button
                    onClick={() => onAddBlock("list")}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                >
                    <List size={12} />
                    <span>List</span>
                </button>
                <button
                    onClick={() => onAddBlock("formula")}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                >
                    <SquareFunction size={12} />
                    <span>LaTeX Formula</span>
                </button>
                <button
                    onClick={() => onAddBlock("table")}
                    className="px-3 py-1.5 bg-[var(--bg-card)] border border-[var(--border-color)] hover:bg-[var(--bg-interactive-hover)] rounded text-xs font-semibold flex items-center gap-1 text-[var(--txt-body-color)] transition-colors cursor-pointer"
                >
                    <Grid3X3 size={12} />
                    <span>Table</span>
                </button>
            </div>
        </div>
    );
}
