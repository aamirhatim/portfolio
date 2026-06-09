import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CodeBlockType } from "../../data/datatypes";
import { BlockWrapper } from "../../lib/articleUtils";

export default function ArticleCode({ block }: { block: CodeBlockType }) {
    return (
        <BlockWrapper border={block.border}>
            <div className="rounded-xl overflow-clip">
                <div className="text-sm">
                    <SyntaxHighlighter
                        language={block.language}
                        style={codeStyle}
                        PreTag={"div"}
                    >
                        {block.content}
                    </SyntaxHighlighter>
                </div>
            </div>
        </BlockWrapper>
    );
}
