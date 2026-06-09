import LazyImg from "./LazyImg";
import { ImageBlockType } from "../../data/datatypes";
import { BlockWrapper } from "../../lib/articleUtils";

export default function ArticleImage({ block }: { block: ImageBlockType }) {
    const imgPath = `/article_img/${block.url}`;
    let size = 'w-full';
    
    switch (block.size) {
        case "sm":
            size = 'w-[100px]';
            break;
        case "md":
            size = 'w-[250px]';
            break;
        case "lg":
            size = 'w-[400px]';
            break;
        case "xl":
            size = 'w-[500px]';
            break;
        default:
            break;
    };

    return (
        <BlockWrapper border={block.border}>
            <div className={`flex flex-col justify-center items-center gap-3 w-full w-max-[500px] px-6 py-6`}>
                <LazyImg
                    imgPath={imgPath}
                    alt={block.url}
                    fill={true}
                    className={`rounded-xl h-full ${size}`}
                />
                {block.caption && <div>{block.caption}</div>}
            </div>
        </BlockWrapper>
    );
}
