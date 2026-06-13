import katex from "katex"
import { FormulaBlockType } from "../../data/datatypes";
import { BlockWrapper } from "../../lib/articleUtils";
import { useEffect, useRef } from "react";

export default function ArticleFormula({ block }: { block: FormulaBlockType }) {
    console.log(block.content)
    const mathRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (mathRef.current) {
            // Safely renders the LaTeX directly into the DOM node
            katex.render(block.content, mathRef.current, {
                displayMode: true, // true acts like BlockMath, false acts like InlineMath
                throwOnError: false
            });
        }
    }, []);

    return (
        <BlockWrapper border={block.border}>
            <div className="w-full text-lg text-center">
                <div ref={mathRef} />
            </div>
        </BlockWrapper>
    );
}
