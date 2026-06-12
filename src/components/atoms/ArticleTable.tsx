import { TableBlockType } from "../../data/datatypes";
import { BlockWrapper } from "../../lib/articleUtils";

export default function ArticleTable({ block }: { block: TableBlockType }) {
    return (
        <BlockWrapper border={block.border}>
            <div className="w-full flex justify-center py-4">
                <div className="border border-(--border-color) rounded-xl w-max max-w-full p-2 bg-(--bg-secondary-color)">
                    <table>
                        <thead>
                            <tr>
                                {block.headers.map((h, key) => <th key={key}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {block.content.map((row, rowKey) => (
                                <tr key={rowKey}>
                                    {row.map((td, tdKey) => (
                                        <td key={tdKey} className={`${rowKey === 0 && '!pt-4'}`}>{td}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </BlockWrapper>
    );
}
