import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import useIsMobile from "../../lib/hooks/useIsMobile";
import { ParagraphBlockType } from "../../data/datatypes";
import { LinkRenderer, BlockWrapper } from "../../lib/articleUtils";

export default function ArticleParagraph({ block }: { block: ParagraphBlockType }) {
    const isMobile = useIsMobile();
    
    return (
        <BlockWrapper border={block.border}>
            <div className={`${isMobile && 'p-hyphen'}`}>
                <ReactMarkdown
                    children={block.content}
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeKatex]}
                    components={{ a: LinkRenderer }}
                />
            </div>
        </BlockWrapper>
    );
}
