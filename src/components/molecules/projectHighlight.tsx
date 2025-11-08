import { ProjectType } from "../../data/datatypes"
import LazyImg from "../atoms/LazyImg";
import { ANIMATION_DURATION_MS } from "../pages/AppLayout";

export default function ProjectHighlight(props: {project:ProjectType}) {
    const imgPath = `/proj_img/${props.project.img}`;
    const placeholderPath = `/proj_thumbs/${props.project.img}`;
    const hoverClasses = `transition duration-[${ANIMATION_DURATION_MS}ms] ease-in-out hover:scale-[1.05] active:scale-[1.03]`;
    
    return (
        <div className={`box-border flex px-6 max-w-[45%] cursor-pointer h-40 ${hoverClasses}`}>
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