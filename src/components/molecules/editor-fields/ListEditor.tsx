import { Plus, X } from "lucide-react";
import { ListBlockType } from "../../../data/datatypes";

type ListEditorProps = {
    block: ListBlockType;
    onChange: (updatedBlock: ListBlockType) => void;
};

export default function ListEditor({ block, onChange }: ListEditorProps) {
    const updateListItem = (itemIndex: number, value: string) => {
        const items = [...block.items];
        items[itemIndex] = value;
        onChange({ ...block, items });
    };

    const addListItem = () => {
        const items = [...block.items, ""];
        onChange({ ...block, items });
    };

    const removeListItem = (itemIndex: number) => {
        const items = block.items.filter((_, idx) => idx !== itemIndex);
        onChange({ ...block, items: items.length > 0 ? items : [""] });
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3 flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">List Header/Title (Optional)</label>
                    <input
                        type="text"
                        value={block.title || ""}
                        onChange={(e) => onChange({ ...block, title: e.target.value })}
                        placeholder="e.g. Key Features:"
                        className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                    />
                </div>
                <div className="col-span-1 flex flex-col justify-center items-center gap-1">
                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Ordered?</label>
                    <input
                        type="checkbox"
                        checked={block.ordered}
                        onChange={(e) => onChange({ ...block, ordered: e.target.checked })}
                        className="w-5 h-5 accent-[var(--txt-highlight-color)] cursor-pointer mt-1"
                    />
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">List Items</label>
                <div className="flex flex-col gap-2">
                    {block.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="flex gap-2 items-center">
                            <span className="text-xs font-semibold text-[var(--txt-subtitle-color)] w-6 text-right">
                                {block.ordered ? `${itemIdx + 1}.` : "•"}
                            </span>
                            <input
                                type="text"
                                value={item}
                                onChange={(e) => updateListItem(itemIdx, e.target.value)}
                                placeholder={`List item ${itemIdx + 1}`}
                                className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] flex-1 focus:outline-none focus:border-[var(--border-focus)]"
                            />
                            <button
                                type="button"
                                onClick={() => removeListItem(itemIdx)}
                                className="p-2 text-[var(--feedback-error)] hover:bg-[var(--feedback-error)]/10 rounded cursor-pointer"
                                title="Remove Item"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
                <button
                    type="button"
                    onClick={addListItem}
                    className="mt-2 text-xs font-bold text-[var(--color-accent-solid)] hover:text-[var(--color-accent-subtle)] flex items-center gap-1 cursor-pointer w-fit"
                >
                    <Plus size={12} />
                    <span>Add List Item</span>
                </button>
            </div>
        </div>
    );
}
