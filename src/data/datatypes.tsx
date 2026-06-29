import { DocumentData, WhereFilterOp } from "firebase/firestore"

export type ProjectType = {
    id: string,
    publishDate: string,
    title: string,
    subtitle: string,
    description: string,
    skills: string[],
    img: string,
    code?: string,
    video?: string,
    spotlight?: boolean,
}

export type BaseArticleBlock = {
    order: number,
    projectId: string,
    border: boolean,
}

export type ParagraphBlockType = BaseArticleBlock & {
    type: "paragraph",
    content: string,
}

export type ImageBlockType = BaseArticleBlock & {
    type: "image",
    url: string,
    caption?: string,
    size?: "sm" | "md" | "lg" | "xl"
}

export type CodeBlockType = BaseArticleBlock & {
    type: "code",
    language: string,
    content: string,
}

export type TitleBlockType = BaseArticleBlock & {
    type: "title",
    level: number,
    content: string,
}

export type ListBlockType = BaseArticleBlock & {
    type: "list",
    ordered: boolean,
    title?: string,
    items: string[],
}

export type FormulaBlockType = BaseArticleBlock & {
    type: "formula",
    content: string,
}

/**
 * TableBlockType format for article tables.
 * IMPORTANT: Firestore does not natively support nested arrays. 
 * Therefore, `content` MUST be an array of objects ({ cells: string[] }[]) 
 * and NOT a raw 2D array (string[][]). Do not flatten this structure or
 * Firebase setDoc calls will fail.
 */
export type TableBlockType = BaseArticleBlock & {
    type: "table",
    headers: string[],
    content: { cells: string[] }[],
}

export type ArticleBlockType =
    | ParagraphBlockType
    | ImageBlockType
    | CodeBlockType
    | TitleBlockType
    | ListBlockType
    | FormulaBlockType
    | TableBlockType

export type ArticleType = {
    blocks: ArticleBlockType[],
    publishDate?: string,
    lastUpdated?: string,
    createdAt: string,
    public: boolean,
}

export type SkillType = {
    name: string,
    type: string,
    level: number,
}

export type JobType = {
    title: string,
    company: string,
    description: string,
    isCurrent: boolean,
    start: string,
    end?: string,
    skills?: Array<string>,
    detail?: string,
}

export type EducationType = {
    id: string,
    degree: {
        short: string,
        long: string,
    },
    field: string,
    school: string,
    start: number,
    end: number
}

export type PatentType = {
    id: string,
    title: string,
    description: string,
    status: string,
    year: number,
    number?: string,
    url?: string
}

export type FirestoreDocType = {
    id: string,
    data: DocumentData,
}

export type FirestoreQueryProps = {
    fieldName: string,
    comparison: WhereFilterOp,
    value: unknown,
}

export type GitHubContributionDay = {
    color: string;
    contributionCount: number;
    contributionLevel: "NONE" | "FIRST_QUARTILE" | "SECOND_QUARTILE" | "THIRD_QUARTILE" | "FOURTH_QUARTILE";
    date: string;
};