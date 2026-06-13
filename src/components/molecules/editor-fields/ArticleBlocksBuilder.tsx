
import { ArticleBlockType } from "../../../data/datatypes";
import BlockHeaderControls from "./BlockHeaderControls";
import BlockToolbar from "./BlockToolbar";
import ParagraphEditor from "./ParagraphEditor";
import TitleEditor from "./TitleEditor";
import ImageEditor from "./ImageEditor";
import CodeEditor from "./CodeEditor";
import ListEditor from "./ListEditor";
import FormulaEditor from "./FormulaEditor";
import TableEditor from "./TableEditor";

interface ArticleBlocksBuilderProps {
    blocks: ArticleBlockType[];
    onAddBlock: (type: ArticleBlockType["type"]) => void;
    onUpdateBlock: (index: number, updatedBlock: ArticleBlockType) => void;
    onDeleteBlock: (index: number) => void;
    onMoveBlock: (index: number, direction: "up" | "down") => void;
    onUpdateBlockBorder: (index: number, border: boolean) => void;
}

export default function ArticleBlocksBuilder({
    blocks,
    onAddBlock,
    onUpdateBlock,
    onDeleteBlock,
    onMoveBlock,
    onUpdateBlockBorder
}: ArticleBlocksBuilderProps) {
    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 pr-2">
                {blocks.map((block, idx) => (
                    <div
                        key={idx}
                        className="p-4 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] flex flex-col gap-4 shadow-sm"
                    >
                        <BlockHeaderControls
                            idx={idx}
                            type={block.type}
                            border={block.border}
                            isFirst={idx === 0}
                            isLast={idx === blocks.length - 1}
                            onBorderChange={(checked) => onUpdateBlockBorder(idx, checked)}
                            onMoveUp={() => onMoveBlock(idx, "up")}
                            onMoveDown={() => onMoveBlock(idx, "down")}
                            onDelete={() => onDeleteBlock(idx)}
                        />

                        <div className="text-sm">
                            {block.type === "paragraph" && (
                                <ParagraphEditor
                                    block={block}
                                    onChange={(updated) => onUpdateBlock(idx, updated)}
                                />
                            )}

                            {block.type === "title" && (
                                <TitleEditor
                                    block={block}
                                    onChange={(updated) => onUpdateBlock(idx, updated)}
                                />
                            )}

                            {block.type === "image" && (
                                <ImageEditor
                                    block={block}
                                    onChange={(updated) => onUpdateBlock(idx, updated)}
                                />
                            )}

                            {block.type === "code" && (
                                <CodeEditor
                                    block={block}
                                    onChange={(updated) => onUpdateBlock(idx, updated)}
                                />
                            )}

                            {block.type === "list" && (
                                <ListEditor
                                    block={block}
                                    onChange={(updated) => onUpdateBlock(idx, updated)}
                                />
                            )}

                            {block.type === "formula" && (
                                <FormulaEditor
                                    block={block}
                                    onChange={(updated) => onUpdateBlock(idx, updated)}
                                />
                            )}

                            {block.type === "table" && (
                                <TableEditor
                                    block={block}
                                    onChange={(updated) => onUpdateBlock(idx, updated)}
                                />
                            )}
                        </div>
                    </div>
                ))}

                {blocks.length === 0 && (
                    <div className="border border-dashed border-[var(--border-color)] p-8 text-center rounded text-[var(--txt-subtitle-color)] bg-[var(--bg-card)]">
                        This article has no content blocks yet. Use the buttons below to add paragraphs, titles, images, tables, etc.
                    </div>
                )}
            </div>

            {/* Add Block Options Toolbar */}
            <div className="flex justify-center w-full">
                <BlockToolbar onAddBlock={onAddBlock} />
            </div>
        </div>
    );
}
