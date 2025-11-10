export default function ProjectArticle(props: {projectId:string}) {
    return (
        <div className="box-border flex flex-col gap-12 bg-red-400">
            {props.projectId}
        </div>
    )
}