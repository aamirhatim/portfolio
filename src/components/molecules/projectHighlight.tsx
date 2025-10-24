import { ProjectType } from "../../data/datatypes"
import LazyImg from "../atoms/LazyImg";

export default function ProjectHighlight(props: {project:ProjectType}) {
    const imgPath = `/proj_img/${props.project.img}`;
    const placeholderPath = `/proj_thumbs/${props.project.img}`;
    
    return (
        <div className="flex">
            <LazyImg
                imgPath={imgPath}
                alt="Project Image"
                className="box-border border border-[var(--border-color)] rounded-xl h-30 w-40 grow-0 shrink-0"
                placeholderPath={placeholderPath}                
            />
            <div className="box-border px-4 w-80">
                <div className="text-md font-bold text-[var(--txt-title-color)] mb-2">{props.project.title}</div>
                <div className="text-sm">{props.project.description}</div>
            </div>
        </div>
    )
}