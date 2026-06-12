import { TitleBlockType } from "../../data/datatypes";
import { BlockWrapper } from "../../lib/articleUtils";

export default function ArticleTitle({ block }: { block: TitleBlockType }) {
    let titleElement = <></>;
    switch (block.level) {
        case 0:
            titleElement = (<h2 className="title mt-12 mb-3">{block.content}</h2>);
            break;
        case 1:
            titleElement = (<h3 className="title mt-8 mb-1">{block.content}</h3>);
            break;
        case 2:
            titleElement = (<h4 className="title mt-4 mb-1">{block.content}</h4>);
            break;
        default:
            break;
    };

    return (
        <BlockWrapper border={block.border}>
            {titleElement}
        </BlockWrapper>
    );
}
