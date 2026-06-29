import { ArticleBlockType } from "../../data/datatypes";
import ArticleParagraph from "./ArticleParagraph";
import ArticleImage from "./ArticleImage";
import ArticleCode from "./ArticleCode";
import ArticleTitle from "./ArticleTitle";
import ArticleList from "./ArticleList";
import ArticleFormula from "./ArticleFormula";
import ArticleTable from "./ArticleTable";

export default function ArticleBlockRenderer({ block }: { block: ArticleBlockType }) {
    switch (block.type) {
        case "paragraph":
            return <ArticleParagraph block={block} />;
        case "image":
            return <ArticleImage block={block} />;
        case "code":
            return <ArticleCode block={block} />;
        case "title":
            return <ArticleTitle block={block} />;
        case "list":
            return <ArticleList block={block} />;
        case "formula":
            return <ArticleFormula block={block} />;
        case "table":
            return <ArticleTable block={block} />;
        default:
            return null;
    }
}
