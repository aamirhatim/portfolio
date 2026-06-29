import { useCallback, useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import ProjectItem from "../molecules/ProjectItem"
import { ProjectType } from "../../data/datatypes";
import useIsMobile from "../../lib/hooks/useIsMobile";
import { orderBy } from "firebase/firestore";
import AnimateInView from "../atoms/AnimateInView";
import GithubContributionTracker from "../organisms/GithubContributionTracker";
import FeaturedWorkCarousel from "../organisms/FeaturedWorkCarousel";
import lodash from "lodash";

export default function ProjectsPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();

    // Init state
    const [projectList, setProjectList] = useState<Record<string, ProjectType[]>>({});
    const [publishedArticles, setPublishedArticles] = useState<Record<string, boolean>>({});

    // Get list of projects and articles
    useEffect(() => {
        let active = true;
        const queryOptions = [
            orderBy("publishDate", "desc")
        ];

        getDocumentsFromCollection(firebaseAppContext, "projects", queryOptions).then((projectDocs) => {
            if (!active) return;
            if (!projectDocs) {
                setProjectList({});
            } else {
                // Group projects by year
                const projectsByYear = lodash.groupBy(
                    projectDocs.map(p => ({ ...p.data, id: p.id } as ProjectType)),
                    p => p.publishDate.split("-")[0]
                );
                setProjectList(projectsByYear);
            }
        });

        getDocumentsFromCollection(firebaseAppContext, "articles").then((articleDocs) => {
            if (!active) return;
            if (articleDocs) {
                const map: Record<string, boolean> = {};
                articleDocs.forEach(doc => {
                    if (doc.data && doc.data.public === true) {
                        map[doc.id] = true;
                    }
                });
                setPublishedArticles(map);
            }
        });

        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

    const createProjectSection = useCallback((projects: ProjectType[], year: string) => {
        return (
            <section key={year} className={`flex flex-col ${isMobile ? 'gap-6 w-full' : 'gap-20'}`}>
                <AnimateInView><h2>{year}</h2></AnimateInView>
                {projects.map((p, idx) => (
                    <AnimateInView key={idx} className="relative hover:z-50">
                        <ProjectItem project={p} hasFirestoreArticle={!!publishedArticles[p.id]} />
                    </AnimateInView>
                ))}
            </section>
        )
    }, [isMobile, publishedArticles]);

    return (
        <div className={`box-border flex flex-col px-4 ${isMobile ? 'gap-10 w-full' : 'gap-15 max-w-[800px] mx-auto'}`}>
            <AnimateInView>
                <FeaturedWorkCarousel />
            </AnimateInView>

            <AnimateInView>
                <GithubContributionTracker />
            </AnimateInView>

            {Object.keys(projectList).length > 0 &&
                Object.entries(projectList).reverse().map(([year, projects]) => createProjectSection(projects, year))
            }
        </div>
    )
}