import { CodeBlockType } from "../../../data/datatypes";

type CodeEditorProps = {
    block: CodeBlockType;
    onChange: (updatedBlock: CodeBlockType) => void;
};

export default function CodeEditor({ block, onChange }: CodeEditorProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-1 w-48">
                <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Language</label>
                <input
                    type="text"
                    value={block.language}
                    onChange={(e) => onChange({ ...block, language: e.target.value })}
                    placeholder="e.g. typescript, python, css"
                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                />
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Code Content</label>
                <textarea
                    value={block.content}
                    onChange={(e) => onChange({ ...block, content: e.target.value })}
                    placeholder="Paste your source code here..."
                    className="p-2.5 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] w-full min-h-[120px] focus:outline-none focus:border-[var(--border-focus)] font-mono text-sm"
                />
            </div>
        </div>
    );
}
