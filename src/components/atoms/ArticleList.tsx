import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { ListBlockType } from "../../data/datatypes";
import { linkRenderer, BlockWrapper } from "../../lib/articleUtils";

export default function ArticleList({ block }: { block: ListBlockType }) {
    const listItems = block.items.map((i, liKey) =>
        <li key={liKey}>
            <ReactMarkdown
                children={i}
                remarkPlugins={[remarkGfm, remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    p: ({ children }) => <>{children}</>,
                    a: linkRenderer
                }}
            />
        </li>
    );

    return (
        <BlockWrapper border={block.border}>
            <div>
                {block.title && <h4 className="!mt-0 mb-2">{block.title}</h4>}
                {block.ordered
                    ? <ol className="list-decimal list-inside pl-6">{listItems}</ol>
                    : <ul className="list-disc list-inside pl-6">{listItems}</ul>
                }
            </div>
        </BlockWrapper>
    );
}
