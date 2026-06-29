import { ChevronUp, ChevronDown, Trash2 } from "lucide-react";

type BlockHeaderControlsProps = {
    idx: number;
    type: string;
    border: boolean;
    isFirst: boolean;
    isLast: boolean;
    onBorderChange: (checked: boolean) => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDelete: () => void;
};

export default function BlockHeaderControls({
    idx,
    type,
    border,
    isFirst,
    isLast,
    onBorderChange,
    onMoveUp,
    onMoveDown,
    onDelete
}: BlockHeaderControlsProps) {
    return (
        <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-2 text-xs">
            <div className="flex items-center gap-2">
                <span className="bg-[var(--bg-secondary-color)] px-2 py-0.5 rounded font-bold text-[var(--txt-feature-color)]">
                    #{idx + 1}
                </span>
                <span className="font-bold uppercase text-[var(--txt-subtitle-color)] tracking-wide">
                    {type}
                </span>
            </div>

            <div className="flex items-center gap-2">
                {/* Border Toggle */}
                <label className="flex items-center gap-1 text-[var(--txt-subtitle-color)] font-medium cursor-pointer">
                    <input
                        type="checkbox"
                        checked={border}
                        onChange={(e) => onBorderChange(e.target.checked)}
                        className="w-3.5 h-3.5 accent-[var(--txt-highlight-color)]"
                    />
                    <span>Border</span>
                </label>

                <span className="h-4 w-[1px] bg-[var(--border-color)] mx-1"></span>

                {/* Reorder Up */}
                <button
                    onClick={onMoveUp}
                    disabled={isFirst}
                    className="p-1 hover:bg-[var(--bg-secondary-color)] rounded text-[var(--txt-subtitle-color)] disabled:opacity-30 cursor-pointer"
                    title="Move Up"
                >
                    <ChevronUp size={14} />
                </button>

                {/* Reorder Down */}
                <button
                    onClick={onMoveDown}
                    disabled={isLast}
                    className="p-1 hover:bg-[var(--bg-secondary-color)] rounded text-[var(--txt-subtitle-color)] disabled:opacity-30 cursor-pointer"
                    title="Move Down"
                >
                    <ChevronDown size={14} />
                </button>

                <span className="h-4 w-[1px] bg-[var(--border-color)] mx-1"></span>

                {/* Delete Block */}
                <button
                    onClick={onDelete}
                    className="p-1 text-[var(--feedback-error)] hover:bg-[var(--feedback-error)]/10 rounded cursor-pointer"
                    title="Delete Block"
                >
                    <Trash2 size={14} />
                </button>
            </div>
        </div>
    );
}
