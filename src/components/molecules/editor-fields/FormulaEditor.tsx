import { FormulaBlockType } from "../../../data/datatypes";

type FormulaEditorProps = {
    block: FormulaBlockType;
    onChange: (updatedBlock: FormulaBlockType) => void;
};

export default function FormulaEditor({ block, onChange }: FormulaEditorProps) {
    return (
        <div className="flex flex-col gap-1">
            <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">LaTeX Equation Content</label>
            <textarea
                value={block.content}
                onChange={(e) => onChange({ ...block, content: e.target.value })}
                placeholder="e.g. \\nabla \\times \\vec{E} = -\\frac{\\partial \\vec{B}}{\\partial t}"
                className="p-2.5 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] w-full min-h-[80px] focus:outline-none focus:border-[var(--border-focus)] font-mono"
            />
        </div>
    );
}
