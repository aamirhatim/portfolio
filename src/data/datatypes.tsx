import { DocumentData, WhereFilterOp } from "firebase/firestore"

export type ProjectType = {
    id: string,
    title: string,
    subtitle: string,
    description: string,
    skills: string[],
    img: string,
    code?: string,
    video?: string,
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
}

export type CodeBlockType = BaseArticleBlock & {
    type: "code",
    language: string,
    code: string,
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

export type ArticleBlockType = 
    | ParagraphBlockType
    | ImageBlockType
    | CodeBlockType
    | TitleBlockType
    | ListBlockType
    | FormulaBlockType

export type ArticleType = {
    blocks: ArticleBlockType[],
    publishDate: string,
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
    summary?: string,
}

export type EducationType = {
    id: string,
    degree: {
        short:string,
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
    value: any,
}