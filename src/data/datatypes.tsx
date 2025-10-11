import { DocumentData } from "firebase/firestore"

export type ProjectType = {
    id: string,
    title: string,
    subtitle: string,
    description: string,
    skills: string[],
    code?:string,
    video?:string
}

export type SkillType = {
    value: string,
    type: string
}

export type JobType = {
    title: string,
    company: string,
    description: string,
    start: string,
    end?: string,
    id: string,
    skills?: Array<string>
}

export type EducationType = {
    id: string,
    degree: string,
    degreeShort?: string,
    major: string,
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