import { ProjectType } from "../../data/datatypes"

export default function ProjectHighlight(props: {project:ProjectType}) {
    return (
        <div className="flex">
            <div className="box-border border rounded-md h-30 w-40"></div>
            <div className="box-border px-4 w-80">
                <div className="text-md font-bold mb-2">{props.project.title}</div>
                <div className="text-sm">{props.project.description}</div>
            </div>
        </div>
    )
}