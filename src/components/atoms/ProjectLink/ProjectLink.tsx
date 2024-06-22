import "./ProjectLink.style.scss"

function ProjectLink( {title, url}:{title:string, url:string} ) {
    return (
        <a href={url}>{title}</a>
    )
}

export default ProjectLink