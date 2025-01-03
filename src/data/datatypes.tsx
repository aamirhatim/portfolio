export type ProjectType = {
    id: string,
    title: string,
    subtitle: string,
    description: string,
    skills: string[],
    code?:string,
    video?:string
}

export type Skill = {
    value: string,
    type: string
}

export type Job = {
    title: string,
    company: string,
    description: string,
    start: string,
    end?: string,
    id: string
}

export type Education = {
    id: string,
    degree: string,
    degreeShort?: string,
    major: string,
    school: string,
    yearStart: number,
    yearEnd: number
}

export type Patent = {
    id: string,
    title: string,
    description: string,
    status: string,
    year: number
}