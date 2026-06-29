import { TitleBlockType } from "../../../data/datatypes";

type TitleEditorProps = {
    block: TitleBlockType;
    onChange: (updatedBlock: TitleBlockType) => void;
};

export default function TitleEditor({ block, onChange }: TitleEditorProps) {
    const levelVal = block.level === 0 ? 2 : block.level === 1 ? 3 : block.level === 2 ? 4 : 2;

    return (
        <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1 flex flex-col gap-1">
                <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Level</label>
                <select
                    value={levelVal}
                    onChange={(e) => {
                        const val = Number(e.target.value);
                        const mappedLevel = val === 2 ? 0 : val === 3 ? 1 : val === 4 ? 2 : 0;
                        onChange({ ...block, level: mappedLevel });
                    }}
                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer"
                >
                    <option value={2}>H2</option>
                    <option value={3}>H3</option>
                    <option value={4}>H4</option>
                </select>
            </div>
            <div className="col-span-3 flex flex-col gap-1">
                <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Title Text</label>
                <input
                    type="text"
                    value={block.content}
                    onChange={(e) => onChange({ ...block, content: e.target.value })}
                    placeholder="Enter heading title..."
                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)] font-semibold"
                />
            </div>
        </div>
    );
}
