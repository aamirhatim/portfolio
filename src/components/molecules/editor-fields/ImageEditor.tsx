import { ImageBlockType } from "../../../data/datatypes";

type ImageEditorProps = {
    block: ImageBlockType;
    onChange: (updatedBlock: ImageBlockType) => void;
};

export default function ImageEditor({ block, onChange }: ImageEditorProps) {
    return (
        <div className="flex flex-col gap-3">
            <div className="grid grid-cols-4 gap-3">
                <div className="col-span-3 flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Image Filename</label>
                    <input
                        type="text"
                        value={block.url}
                        onChange={(e) => onChange({ ...block, url: e.target.value })}
                        placeholder="e.g. my-photo.jpg"
                        className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                    />
                </div>
                <div className="col-span-1 flex flex-col gap-1">
                    <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Size</label>
                    <select
                        value={block.size || "lg"}
                        onChange={(e) => onChange({ ...block, size: e.target.value as ImageBlockType["size"] })}
                        className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)] cursor-pointer"
                    >
                        <option value="sm">Small</option>
                        <option value="md">Medium</option>
                        <option value="lg">Large</option>
                        <option value="xl">X-Large</option>
                    </select>
                </div>
            </div>
            <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[var(--txt-subtitle-color)]">Caption (Optional)</label>
                <input
                    type="text"
                    value={block.caption || ""}
                    onChange={(e) => onChange({ ...block, caption: e.target.value })}
                    placeholder="Enter image caption..."
                    className="p-2 border border-[var(--border-color)] rounded bg-[var(--bg-color)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                />
            </div>
        </div>
    );
}
