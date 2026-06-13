import { ParagraphBlockType } from "../../../data/datatypes";

type ParagraphEditorProps = {
    block: ParagraphBlockType;
    onChange: (updatedBlock: ParagraphBlockType) => void;
};

export default function ParagraphEditor({ block, onChange }: ParagraphEditorProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Content (Markdown supported)</label>
            <textarea
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="Type paragraph text..."
                className="p-2.5 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] w-full min-h-[100px] focus:outline-none focus:border-[var(--border-focus)] font-serif text-base"
            />
        </div>
    );
}
