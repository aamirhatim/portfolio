import { TitleBlockType } from "../../data/datatypes";
import { BlockWrapper } from "../../lib/articleUtils";

export default function ArticleTitle({ block }: { block: TitleBlockType }) {
    let titleElement = <></>;
    switch (block.level) {
        case 0:
            titleElement = (<h2 className="title">{block.content}</h2>);
            break;
        case 1:
            titleElement = (<h3 className="title">{block.content}</h3>);
            break;
        case 2:
            titleElement = (<h4 className="title">{block.content}</h4>);
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
