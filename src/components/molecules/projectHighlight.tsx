import { useEffect, useRef } from "react";
import { ProjectType } from "../../data/datatypes"

export default function ProjectHighlight(props: {project:ProjectType}) {
    // Create refs
    const imgRef = useRef<HTMLDivElement>(null);

    // Set project bg image
    useEffect( () => {
        if (!imgRef.current || !props.project.img) return;

        const img = imgRef.current;
        const imgPath = `/project_img/${props.project.img}`;
        img.style.backgroundImage = `url(${imgPath})`;
        img.style.backgroundSize = "cover";
        img.style.backgroundPosition = "center";
    }, []);
    
    return (
        <div className="flex">
            <div ref={imgRef} className="box-border border border-[var(--border-color)] rounded-xl h-30 w-40"></div>
            <div className="box-border px-4 w-80">
                <div className="text-md font-bold text-[var(--txt-title-color)] mb-2">{props.project.title}</div>
                <div className="text-sm">{props.project.description}</div>
            </div>
        </div>
    )
}