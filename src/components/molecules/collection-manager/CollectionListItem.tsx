
import { ChevronDown, ChevronRight, Pencil, Trash2 } from "lucide-react";
import { FirestoreDocType } from "../../../data/datatypes";

interface CollectionListItemProps {
    doc: FirestoreDocType;
    summaryText: string;
    isExpanded: boolean;
    showDetails: boolean;
    onToggleExpand: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export default function CollectionListItem({
    doc,
    summaryText,
    isExpanded,
    showDetails,
    onToggleExpand,
    onEdit,
    onDelete
}: CollectionListItemProps) {
    return (
        <div className="flex flex-col p-4 rounded bg-[var(--bg-secondary-color)]">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3 overflow-hidden max-w-[60%]">
                    {showDetails && (
                        <button
                            onClick={onToggleExpand}
                            className="text-[var(--txt-subtitle-color)] hover:text-[var(--txt-feature-color)] transition-colors flex-shrink-0 cursor-pointer"
                        >
                            {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                    )}
                    <div className="font-medium text-[var(--txt-feature-color)] truncate">
                        {summaryText}
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={onEdit}
                        className="p-2 text-[var(--txt-subtitle-color)] hover:bg-[var(--txt-highlight-color)] hover:text-[var(--bg-color)] rounded transition-colors cursor-pointer"
                        title="Edit"
                    >
                        <Pencil size={16} />
                    </button>
                    <button
                        onClick={onDelete}
                        className="p-2 text-[var(--txt-subtitle-color)] hover:bg-[var(--feedback-error)] hover:text-[var(--bg-color)] rounded transition-colors cursor-pointer"
                        title="Delete"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            </div>
            {showDetails && isExpanded && (
                <div className="mt-4 pt-4 px-4 border-t border-[var(--border-color)] overflow-x-auto">
                    <table className="w-full text-left text-sm text-[var(--txt-body-color)]">
                        <tbody>
                            {Object.entries(doc.data).map(([key, val]) => (
                                <tr key={key} className="border-b border-[var(--border-color)] last:border-0">
                                    <td className="py-2 pr-4 font-semibold align-top w-36 min-w-[9rem]">{key}</td>
                                    <td className="py-2 break-all">{typeof val === 'object' ? JSON.stringify(val, null, 2) : String(val)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
