import ProjectHighlight from "../molecules/projectHighlight"
import introTxt from '../../data/intro'
import ArrowBtn from '../atoms/ArrowBtn'
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { useEffect, useState } from "react"
import { FirestoreDocType, ProjectType } from "../../data/datatypes"
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import { where } from "firebase/firestore"

export default function HomePage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [projSpotlightList, setProjSpotlightList] = useState<FirestoreDocType[]>([]);

    // Get list of spotlight projects
    useEffect( () => {
        const getSpotlights = async () => {
            const filter = where("spotlight", "==", true);

            const spotlights = await getDocumentsFromCollection(firebaseAppContext, "projects", [filter]);
            setProjSpotlightList(spotlights);
        };
        getSpotlights();
    }, []);

    return (
        <div className="box-border pl-[12%] flex flex-col w-full gap-40">
            <div className="flex w-[55%] text-5xl font-bold text-[var(--txt-feature-color)]">{introTxt}</div>

            <section>
                <div className="text-4xl font-bold mb-10">Featured work</div>
                <div className="flex flex-wrap gap-5">
                    {projSpotlightList.map( (p, idx) => <ProjectHighlight key={idx} project={p.data as ProjectType} />)}
                </div>
                
                <ArrowBtn text="See more" link="projects" />
            </section>
        </div>
    )
}