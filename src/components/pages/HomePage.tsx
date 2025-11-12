import ProjectHighlight from "../molecules/projectHighlight"
import ArrowBtn from '../atoms/ArrowBtn'
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { useEffect, useState } from "react"
import { FirestoreDocType, ProjectType } from "../../data/datatypes"
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import { where } from "firebase/firestore"
import useIsMobile from "../hooks"

export default function HomePage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [introTxt, setIntroTxt] = useState<string>("");
    const [projSpotlightList, setProjSpotlightList] = useState<FirestoreDocType[]>([]);

    // Get intro text
    useEffect(() => {
        const getIntroTxt = async () => {
            const txt = await getDocumentsFromCollection(firebaseAppContext, "intro");
            setIntroTxt(txt[0].data.text);
        };
        getIntroTxt();
    }, []);

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
        <div className="box-border flex flex-col w-full gap-40">
            <div className={`px-6 flex font-bold text-[var(--txt-feature-color)] ${isMobile ? 'text-4xl' : 'text-5xl w-[65%]'}`}>{introTxt}</div>

            <section className="flex flex-col gap-8">
                <div className="text-4xl font-bold px-6">Featured work</div>
                <div className={`flex flex-wrap`}>
                    {projSpotlightList.map( (p, idx) => <ProjectHighlight key={idx} project={{id: p.id, ...p.data} as ProjectType} />)}
                </div>
                
                <div className={`w-full px-6 flex ${isMobile && 'justify-center'}`}>
                    <ArrowBtn text="See more" link="projects" />
                </div>
            </section>
        </div>
    )
}