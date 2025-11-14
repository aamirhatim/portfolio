import { useEffect, useState } from "react"
import { ArticleBlockType, ArticleType, ProjectType } from "../../data/datatypes";
import { getDocumentFromId } from "../../lib/firestoreLib";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import ChipGroup from "../molecules/ChipGroup";
import { ANIMATION_DURATION_MS } from "../pages/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import useIsMobile from "../hooks";
import LazyImg from "../atoms/LazyImg";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { nightOwl as codeStyle } from "react-syntax-highlighter/dist/esm/styles/prism";

type ProjectArticleProps = {
    projectId: string,
    transitionDir: "next" | "prev",
}

type ArticleImportFn = () => Promise<ArticleType|undefined>;

// Create a map of all articles so the right one can be imported when queried
const articleModules: Record<string, ArticleImportFn> = import.meta.glob("/src/data/articles/*.json") as Record<string, ArticleImportFn>;

// Define motion variants for animation
const slideDist = 250;
const easing = "easeInOut" as "easeInOut";
const variants = {
    exit: (direction: string) => ({
        x: direction ==="next" ? -1 * slideDist : slideDist,
        opacity: 0,
        transition: {
            duration: 0.25 * ANIMATION_DURATION_MS / 1000,
            ease: easing,
        }
    }),
    enter: {
        x: 0,
        opacity: 1,
        transition: {
            duration: 0.25 * ANIMATION_DURATION_MS / 1000,
            ease: easing,
        }
    },
    initial: (direction: string) => ({
        x: direction === "next" ? slideDist : -1 * slideDist,
        opacity: 0,
    })
};

export default function ProjectArticle(props: ProjectArticleProps) {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();

    // Init state
    const [project, setProject] = useState<ProjectType>();
    const [article, setArticle] = useState<ArticleType|undefined>(undefined);

    // Create section for article block
    const createSection = (block:ArticleBlockType, key:number) => {
        let e = <></>;

        switch (block.type) {
            case "paragraph":

                e = (
                    <div className={`${isMobile && 'p-hyphen'}`}>
                        <ReactMarkdown
                            children={block.content}
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                        />
                    </div>
                );
                break;

            case "image":
                const imgPath = `/article_img/${block.url}`;
                let size = 'w-full';
                switch (block.size) {
                    case "sm":
                        size = 'w-[100px]';
                        break;

                    case "md":
                        size = 'w-[250px]';
                        break;

                    case "lg":
                        size = 'w-[400px]';
                        break;

                    case "xl":
                        size = 'w-[500px]';
                        break;
                
                    default:
                        break;
                };
                e = (
                    <div className={`flex flex-col justify-center items-center gap-3 w-full w-max-[500px] px-6 py-6`}>
                        <LazyImg
                            imgPath={imgPath}
                            alt={block.url}
                            fill={true}
                            className={`rounded-xl h-full ${size}`}
                        />
                        {block.caption && <div>{block.caption}</div>}
                    </div>
                );
                break;

            case "code":
                e = (
                    <div className="rounded-xl overflow-clip">
                        <div className="text-sm">
                            <SyntaxHighlighter
                                language={block.language}
                                style={codeStyle}
                                PreTag={"div"}
                            >
                                {block.content}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                );
                break;

            case "title":
                switch (block.level) {
                    case 0:
                        e = ( <h2>{block.content}</h2> );
                        break;

                    case 1:
                        e = ( <h3>{block.content}</h3> );
                        break;

                    case 2:
                        e = ( <h4>{block.content}</h4> );
                        break;
                
                    default:
                        break;
                };
                break;

            case "list":
                // Create list item objects
                const listItems = block.items.map((i, liKey) => 
                    <li key={liKey}>
                        <ReactMarkdown
                            children={i}
                            remarkPlugins={[remarkGfm, remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{p: ({children}) => <>{children}</>}} // Remove <p> tag from list items
                        />
                    </li>
                );

                e = (
                    <div>
                        {block.title && <h4 className="!mt-0 mb-2">{block.title}</h4>}
                        {block.ordered
                            ? <ol className="list-decimal list-inside pl-6">{listItems}</ol>
                            : <ul className="list-disc list-inside pl-6">{listItems}</ul>
                        }
                    </div>
                );
                break;

            case "formula":
                e = (
                    <div className="w-full text-lg text-center">
                        <BlockMath
                            math={block.content}
                            errorColor={"#cc0000"}
                        />
                    </div>
                );
                break;

            case "table":
                e = (
                    <table>
                        <thead>
                            <tr>
                                {block.headers.map((h, key) => <th key={key}>{h}</th>)}
                            </tr>
                        </thead>

                        <tbody>
                            {block.content.map((row, rowKey) => (
                                <tr key={rowKey}>
                                    {row.map((td, tdKey) => (
                                        <td key={tdKey}>{td}</td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                );
                break;
        
            default:
                break;
        };

        if (block.border) {
            return (
                <div key={key} className="w-full flex justify-center my-6">
                    <div className={`border border-(--border-color) rounded-xl p-6 ${isMobile ? 'w-full' : 'w-[80%]'}`}>{e}</div>
                </div>
            );
        } else {
            return (
                <div key={key}>{e}</div>
            );
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
        };

        getProject();
    }, [props.projectId, firebaseAppContext]);

    // Get project article
    useEffect(() => {
        const getArticleData = async () => {
            // 1. Create file path for article
            const articlePath = `/src/data/articles/${props.projectId}.json`;

            // 2. Look up dynamic import function in articleModule map
            const importFunction = articleModules[articlePath];
            if (!importFunction) {
                console.warn(`No article found for ${props.projectId}`);
                setArticle(undefined);
                return;
            }

            // 3. Import the article
            try {
                const module = await importFunction();
                setArticle(module);
            } catch (error) {
                console.error(`Failed to load article for ${props.projectId}: ${error}`);
                setArticle(undefined);
                return;
            }
        };
        getArticleData();
    }, [props.projectId, firebaseAppContext]);

    return (
        <AnimatePresence mode="wait" initial={false}>
            <motion.div
                key={props.projectId}
                custom={props.transitionDir}
                variants={variants}
                initial="initial"
                animate="enter"
                exit="exit"
                className="relative w-full"
            >
                <div className={`absolute h-120 w-full -z-10 ${isMobile ? '-top-40' : '-top-10 px-[10%]'}`}>
                    {project &&
                        <LazyImg
                            imgPath={`/proj_img/${project?.img}`}
                            alt={'Project image'}
                            placeholderPath={`/proj_thumbs/${project?.img}`}
                            className='h-full w-full grayscale-75 opacity-20 rounded-t-4xl'
                        />
                    }
                    <div className="absolute top-0 h-full w-full bg-gradient-to-t from-(--bg-color) to-transparent"></div>
                </div>

                <div className={`flex flex-col gap-3 w-full ${isMobile ? 'px-6' : 'px-[15%]'}`}>
                    <div className={`mb-5 font-bold text-6xl text-(--txt-title-color) w-[70%] ${isMobile ? 'mt-40' : 'mt-70 break-words'}`}>{project?.title}</div>

                    {article !== undefined
                        ?   <>
                                <div className="mb-15 text-(--txt-feature-color)">{article.publishDate}</div>
                                {article.blocks.map((b, key) => createSection(b, key))}

                                <div>
                                <div className="mt-20 font-bold text-lg text-(--txt-title-color) mb-3">Keywords</div>
                                    <ChipGroup list={project?.skills || []} />
                                </div>
                            </>
                        :   <div className="border border-(--border-color) p-6 rounded-xl">
                                <p>Oh no! Looks like there's nothing here yet. If you want to know more about this project, please reach out!</p>
                            </div>
                    }
                </div>
            </motion.div>
        </AnimatePresence>
    )
}