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
            if (!txt) {
                setIntroTxt("");
                return;
            }
            setIntroTxt(txt[0].data.text);
        };
        getIntroTxt();
    }, []);

    // Get list of spotlight projects
    useEffect( () => {
        const getSpotlights = async () => {
            const filter = where("spotlight", "==", true);

            const spotlights = await getDocumentsFromCollection(firebaseAppContext, "projects", [filter]);
            if (!spotlights) {
                setProjSpotlightList([]);
                return;
            }
            setProjSpotlightList(spotlights);
        };
        getSpotlights();
    }, []);


    return (
        <div className="box-border flex flex-col w-full gap-40">
            <div className={`feature flex text-(--txt-feature-color) ${isMobile ? 'text-5xl px-4' : 'text-6xl w-[65%] px-10'}`}>{introTxt}</div>

            {projSpotlightList.length > 0 &&
                <section className="flex flex-col gap-8">
                    <div className={`title text-3xl ${isMobile ? 'px-4' : 'px-10'}`}>Featured work</div>
                    <div className={`flex flex-col gap-4`}>
                        {projSpotlightList.map((p, idx) => <ProjectHighlight key={idx} project={{id: p.id, ...p.data} as ProjectType} idx={idx} />)}
                    </div>
                    
                    <div className={`w-full flex text-lg ${isMobile ? 'px-4' : 'px-10'}`}>
                        <ArrowBtn text="See more" link="/projects" className="!text-(--txt-subtitle-color)"/>
                    </div>
                </section>
            }
        </div>
    )
}