import { useEffect, useState } from "react"
import { ArticleBlockType, ArticleType, ProjectType } from "../../data/datatypes";
import { getDocumentFromId, getDocumentsFromCollection } from "../../lib/firestoreLib";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import ChipGroup from "../molecules/ChipGroup";
import { orderBy, where } from "firebase/firestore";

export default function ProjectArticle(props: {projectId:string}) {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [project, setProject] = useState<ProjectType>();
    const [article, setArticle] = useState<ArticleType>({blocks: [], publishDate: ""});

    // Create section for article block
    const createSection = (block:ArticleBlockType, key:number) => {
        switch (block.type) {
            case "paragraph":
                return (
                    <div key={key} className="text-(--txt-body-color) text-lg">{block.content}</div>
                );

            case "image":
                return (
                    <div key={key}><img src={block.url} /></div>
                );

            case "code":
                return (
                    <div key={key} className="text-(--txt-accent-color) text-lg">{block.code}</div>
                );
        
            default:
                return <></>;
        }
    };

    // Get project info
    useEffect(() => {
        const getProject = async () => {
            const projectDoc = await getDocumentFromId(firebaseAppContext, "projects", props.projectId);
            if (!projectDoc) return;

            const projectData = {
                id: projectDoc.id,
                ...projectDoc.data,
            } as ProjectType;
            setProject(projectData);
        };

        getProject();
    }, [props.projectId]);

    // Get project article
    useEffect(() => {
        const getArticleData = async () => {
            // 1. Get article metadata
            const metaDoc = await getDocumentFromId(firebaseAppContext, "article_meta", props.projectId);
            if (!metaDoc) return;

            // 2. Get article blocks
            const filter = where("projectId", "==", props.projectId);
            const sort = orderBy("order", "asc");
            const blocksDoc = await getDocumentsFromCollection(firebaseAppContext, "article_blocks", [filter, sort]);
            if (!blocksDoc) return;
            const blocks = blocksDoc.map(data => data.data as ArticleBlockType);
            
            // 3. Structure data
            const articleData:ArticleType = {
                publishDate: metaDoc.data.publishDate,
                blocks: blocks,
            };

            // 4. Update state
            setArticle(articleData);
        };

        getArticleData();
    }, [props.projectId]);

    return (
        <div className="box-border flex flex-col gap-12">
            <div className="font-bold text-6xl text-(--txt-title-color)">{project?.title}</div>

            {article.blocks.length > 0
                ?   <>
                        {article.blocks.map((b, key) => {return createSection(b, key)})}
                        <div className="text-md text-(--txt-feature-color)">{article.publishDate}</div>

                        <div>
                        <div className="font-bold text-lg text-(--txt-title-color) mb-3">Keywords</div>
                            <ChipGroup list={project?.skills || []} />
                        </div>
                    </>
                :   <div className="border border-(--border-color) p-6 rounded-xl">
                        <p>Oh no! Looks like there's nothing here yet. If you want to know more about this project, please reach out!</p>
                    </div>
            }
        </div>
    )
}