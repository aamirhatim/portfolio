import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { FormulaBlockType } from "../../data/datatypes";
import { BlockWrapper } from "../../lib/articleUtils";

export default function ArticleFormula({ block }: { block: FormulaBlockType }) {
    return (
        <BlockWrapper border={block.border}>
            <div className="w-full text-lg text-center">
                <BlockMath
                    math={block.content}
                    errorColor={"#cc0000"}
                />
            </div>
        </BlockWrapper>
    );
}
