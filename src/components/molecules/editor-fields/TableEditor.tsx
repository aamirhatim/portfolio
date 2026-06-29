import { TableBlockType } from "../../../data/datatypes";

type TableEditorProps = {
    block: TableBlockType;
    onChange: (updatedBlock: TableBlockType) => void;
};

export default function TableEditor({ block, onChange }: TableEditorProps) {
    const addTableCol = () => {
        const headers = [...block.headers, `Header ${block.headers.length + 1}`];
        // Preserve object wrapper to satisfy Firestore nested array constraint
        const content = block.content.map(row => ({ ...row, cells: [...row.cells, ""] }));
        onChange({ ...block, headers, content });
    };

    const removeTableCol = () => {
        if (block.headers.length <= 1) return;
        const headers = block.headers.slice(0, -1);
        const content = block.content.map(row => ({ ...row, cells: row.cells.slice(0, -1) }));
        onChange({ ...block, headers, content });
    };

    const addTableRow = () => {
        // Add new row wrapped in object
        const content = [...block.content, { cells: Array(block.headers.length).fill("") }];
        onChange({ ...block, content });
    };

    const removeTableRow = () => {
        if (block.content.length <= 1) return;
        const content = block.content.slice(0, -1);
        onChange({ ...block, content });
    };

    const updateTableCell = (rowIdx: number, colIdx: number, value: string) => {
        // Map over {cells: []} wrappers carefully to maintain structure
        const content = block.content.map((row, r) => ({
            ...row,
            cells: row.cells.map((cell, c) => (r === rowIdx && c === colIdx ? value : cell))
        }));
        onChange({ ...block, content });
    };

    const updateTableHeader = (colIdx: number, value: string) => {
        const headers = [...block.headers];
        headers[colIdx] = value;
        onChange({ ...block, headers });
    };

    return (
        <div className="flex flex-col gap-3">
            {/* Columns Actions */}
            <div className="flex items-center gap-4 text-xs">
                <span className="font-semibold text-[var(--txt-subtitle-color)]">Table Columns ({block.headers.length}):</span>
                <button
                    type="button"
                    onClick={addTableCol}
                    className="text-[var(--color-accent-solid)] font-bold hover:underline cursor-pointer"
                >
                    + Add Column
                </button>
                <button
                    type="button"
                    onClick={removeTableCol}
                    className="text-[var(--feedback-error)] font-bold hover:underline cursor-pointer disabled:opacity-30"
                    disabled={block.headers.length <= 1}
                >
                    - Remove Column
                </button>
            </div>

            <div className="overflow-x-auto max-w-full border border-[var(--border-color)] rounded p-2 bg-[var(--bg-color)]">
                <table className="min-w-full table-auto text-left text-xs border-collapse">
                    <thead>
                        <tr>
                            {block.headers.map((h, colIdx) => (
                                <th key={colIdx} className="p-1 min-w-[100px]">
                                    <input
                                        type="text"
                                        value={h}
                                        onChange={(e) => updateTableHeader(colIdx, e.target.value)}
                                        className="p-1 w-full border border-[var(--border-color)] rounded bg-[var(--bg-card)] text-[var(--txt-feature-color)] font-bold focus:outline-none focus:border-[var(--border-focus)]"
                                    />
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {block.content.map((row, rowIdx) => (
                            <tr key={rowIdx}>
                                {row.cells.map((cell, colIdx) => (
                                    <td key={colIdx} className="p-1">
                                        <input
                                            type="text"
                                            value={cell}
                                            onChange={(e) => updateTableCell(rowIdx, colIdx, e.target.value)}
                                            className="p-1 w-full border border-[var(--border-color)] rounded bg-[var(--bg-card)] text-[var(--txt-body-color)] focus:outline-none focus:border-[var(--border-focus)]"
                                        />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Row Actions */}
            <div className="flex items-center gap-4 text-xs">
                <span className="font-semibold text-[var(--txt-subtitle-color)]">Table Rows ({block.content.length}):</span>
                <button
                    type="button"
                    onClick={addTableRow}
                    className="text-[var(--color-accent-solid)] font-bold hover:underline cursor-pointer"
                >
                    + Add Row
                </button>
                <button
                    type="button"
                    onClick={removeTableRow}
                    className="text-[var(--feedback-error)] font-bold hover:underline cursor-pointer disabled:opacity-30"
                    disabled={block.content.length <= 1}
                >
                    - Remove Row
                </button>
            </div>
        </div>
    );
}
