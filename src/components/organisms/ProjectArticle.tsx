import { useEffect, useState } from "react"
import { ArticleType, ProjectType } from "../../data/datatypes";
import { getDocumentFromId } from "../../lib/firestoreLib";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import ChipGroup from "../molecules/ChipGroup";
import useIsMobile from "../../lib/hooks/useIsMobile";
import LazyImg from "../atoms/LazyImg";
import ProjectLink from "../atoms/ProjectLink";
import ArticleBlockRenderer from "../atoms/ArticleBlockRenderer";

type ProjectArticleProps = {
    projectId: string,
    transitionDir: "next" | "prev",
}


export default function ProjectArticle(props: ProjectArticleProps) {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();

    // Init state
    const [project, setProject] = useState<ProjectType>();
    const [article, setArticle] = useState<ArticleType | undefined>(undefined);


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

            if (active) setArticle(undefined);
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
                        {article.blocks.map((b, key) => (
                            <ArticleBlockRenderer key={key} block={b} />
                        ))}

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