import { useEffect, useRef, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import ProjectItem from "../molecules/ProjectItem"
import { FirestoreDocType, ProjectType } from "../../data/datatypes";
import useIsMobile from "../hooks";
import { motion } from "framer-motion";

export default function ProjectsPage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();
    const isMobile = useIsMobile();

    // Init state
    const [projectList, setProjectList] = useState<FirestoreDocType[]>([]);

    // Create refs
    const sectionRef = useRef<HTMLDivElement>(null);

    // Get list of projects
    useEffect( () => {
        const getProjects = async () => {
            const projectList = await getDocumentsFromCollection(firebaseAppContext, "projects");
            if (!projectList) {
                setProjectList([]);
                return;
            }
            setProjectList(projectList);
        };
        getProjects();
    }, []);

    return (
        <section ref={sectionRef} className={`box-border pt-40 flex flex-col mx-auto ${isMobile ? 'px-4 gap-6' : 'gap-18 max-w-[1000px]'}`}>
            {projectList.map((p, idx) => {
                return (
                    <motion.div
                        key={idx}
                        initial={{opacity: 0, x: 50, y: 50}}
                        whileInView={{opacity: 1, x: 0, y: 0}}
                        viewport={{
                            once: true,
                            amount: 0.15,
                        }}
                        transition={{
                            type: "spring",
                            bounce: .4,
                            duration: .7,
                        }}
                    >
                        <ProjectItem project={{...p.data, id: p.id as string} as ProjectType} />
                    </motion.div>
                )
            })}
        </section>
    )
}