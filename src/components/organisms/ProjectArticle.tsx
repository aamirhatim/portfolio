import { useEffect, useState } from "react"
import { ArticleBlockType, ArticleType, ProjectType } from "../../data/datatypes";
import { getDocumentFromId } from "../../lib/firestoreLib";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import ChipGroup from "../molecules/ChipGroup";
import useIsMobile from "../../lib/hooks/useIsMobile";
import LazyImg from "../atoms/LazyImg";
import ProjectLink from "../atoms/ProjectLink";
import ArticleParagraph from "../atoms/ArticleParagraph";
import ArticleImage from "../atoms/ArticleImage";
import ArticleCode from "../atoms/ArticleCode";
import ArticleTitle from "../atoms/ArticleTitle";
import ArticleList from "../atoms/ArticleList";
import ArticleFormula from "../atoms/ArticleFormula";
import ArticleTable from "../atoms/ArticleTable";

type ProjectArticleProps = {
    projectId: string,
    transitionDir: "next" | "prev",
}

type ArticleImportFn = () => Promise<ArticleType | undefined>;

// Create a map of all articles so the right one can be imported when queried
const articleModules: Record<string, ArticleImportFn> = import.meta.glob("/src/data/articles/*.json") as Record<string, ArticleImportFn>;

export default function ProjectArticle(props: ProjectArticleProps) {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();

    // Init state
    const [project, setProject] = useState<ProjectType>();
    const [article, setArticle] = useState<ArticleType | undefined>(undefined);

    // Create section for article block
    const createSection = (block: ArticleBlockType, key: number) => {
        switch (block.type) {
            case "paragraph":
                return <ArticleParagraph key={key} block={block} />;
            case "image":
                return <ArticleImage key={key} block={block} />;
            case "code":
                return <ArticleCode key={key} block={block} />;
            case "title":
                return <ArticleTitle key={key} block={block} />;
            case "list":
                return <ArticleList key={key} block={block} />;
            case "formula":
                return <ArticleFormula key={key} block={block} />;
            case "table":
                return <ArticleTable key={key} block={block} />;
            default:
                return <div key={key}>Unsupported block type</div>;
        }
    };

    // Get project info
    useEffect(() => {
        const getProject = async () => {
            const projectDoc = await getDocumentFromId(firebaseAppContext, "projects", props.projectId);
            if (!projectDoc) {
                setProject(undefined);
                setArticle(undefined);
                return;
            };

            const projectData = {
                id: projectDoc.id,
                ...projectDoc.data,
            } as ProjectType;
            setProject(projectData);

            // Update title page using project title
            document.title = `Aamir Husain | ${projectData.title}`;
        };

        getProject();
    }, [props.projectId, firebaseAppContext]);

    // Get project article
    useEffect(() => {
        let active = true;
        const getArticleData = async () => {
            try {
                const firestoreDoc = await getDocumentFromId(firebaseAppContext, "articles", props.projectId);
                if (firestoreDoc && active) {
                    const articleData = firestoreDoc.data as ArticleType;
                    if (articleData.public) {
                        setArticle(articleData);
                        return;
                    } else {
                        setArticle(undefined);
                        return;
                    }
                }
            } catch (error) {
                console.error(`Failed to fetch article from Firestore for ${props.projectId}:`, error);
            }

            if (!active) return;

            // Create file path for fallback article
            const articlePath = `/src/data/articles/${props.projectId}.json`;

            // Look up dynamic import function in articleModule map
            const importFunction = articleModules[articlePath];
            if (!importFunction) {
                if (active) setArticle(undefined);
                return;
            }

            // Import the fallback article
            try {
                const module = await importFunction();
                if (active) {
                    setArticle(module);
                }
            } catch (error) {
                console.error(`Failed to load article fallback for ${props.projectId}: ${error}`);
                if (active) setArticle(undefined);
            }
        };
        getArticleData();
        return () => {
            active = false;
        };
    }, [props.projectId, firebaseAppContext]);

    return (
        <div className="relative w-full">
            <div className={`absolute h-120 w-full -z-10 ${isMobile ? '-top-40' : '-top-10 px-[10%]'}`}>
                {project &&
                    <LazyImg
                        imgPath={`/proj_img/${project?.img}`}
                        alt={'Project image'}
                        placeholderPath={`/thumbs/${project?.img}`}
                        className='h-full w-full grayscale-75 opacity-20 rounded-t-xl'
                    />
                }
                <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-t from-(--bg-color) to-transparent"></div>
            </div>

            <div className={`flex flex-col gap-3 w-full ${isMobile ? 'px-4' : 'max-w-[800px] mx-auto'}`}>
                <div className={`mb-5 title text-6xl text-(--txt-body-color) w-[70%] ${isMobile ? 'mt-40' : 'mt-70 break-words'}`}>{project?.title}</div>
                <div className="flex gap-3">
                    {project?.code && <ProjectLink value="Code" url={project.code} newTab={true} showText={true} />}
                    {project?.video && <ProjectLink value="Video" url={project.video} newTab={true} showText={true} />}
                </div>

                {article !== undefined
                    ? <>
                        <div className="mb-15 text-(--txt-feature-color)">{article.publishDate}</div>
                        {article.blocks.map((b, key) => createSection(b, key))}

                        <div>
                            <div className="mt-20 title text-lg text-(--txt-title-color) mb-3">Keywords</div>
                            <ChipGroup list={project?.skills || []} />
                        </div>
                    </>
                    : <div className="border border-(--border-color) p-6 rounded-xl">
                        <p>Oh no! Looks like there's nothing here yet. If you want to know more about this project, please reach out!</p>
                    </div>
                }
            </div>
        </div>
    )
}