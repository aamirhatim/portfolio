import { DocumentData, WhereFilterOp } from "firebase/firestore"

export type ProjectType = {
    id: string,
    title: string,
    subtitle: string,
    description: string,
    skills: string[],
    code?: string,
    video?: string,
    img?: string,
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
    startDate: string,
    endDate?: string,
    skills?: Array<string>,
}

export type EducationType = {
    id: string,
    degree: {
        short:string,
        long: string,
    },
    field: string,
    school: string,
    yearStart: number,
    yearEnd: number
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