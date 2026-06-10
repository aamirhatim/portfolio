import ProjectHighlight from "../molecules/projectHighlight"
import ArrowBtn from '../atoms/ArrowBtn'
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { useEffect, useState } from "react"
import { FirestoreDocType, ProjectType } from "../../data/datatypes"
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import { orderBy, where } from "firebase/firestore"
import useIsMobile from "../../lib/hooks/useIsMobile"

export default function HomePage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [introTxt, setIntroTxt] = useState<string[]>([]);
    const [projSpotlightList, setProjSpotlightList] = useState<FirestoreDocType[]>([]);

    // Get intro and projects
    useEffect(() => {
        let active = true;

        getDocumentsFromCollection(firebaseAppContext, "introText").then((textDoc) => {
            if (!active) return;
            if (textDoc && textDoc.length > 0) {
                const text = textDoc[0].data.text as string;
                setIntroTxt(text.split(" "));
            }
        });

        const filter = [
            where("spotlight", "==", true),
            orderBy("publishDate", "desc")
        ];
        getDocumentsFromCollection(firebaseAppContext, "projects", filter).then((spotlights) => {
            if (!active) return;
            if (!spotlights) {
                setProjSpotlightList([]);
            } else {
                setProjSpotlightList(spotlights);
            }
        });

        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

    return (
        <>
            {introTxt.length > 0 &&
                <div className="box-border flex flex-col w-full gap-5">
                    <div
                        className={`box-border feature w-full flex flex-wrap content-start text-(--txt-feature-color) ${isMobile ? 'mb-20 text-5xl px-4 gap-x-3 gap-y-2' : 'mb-50 text-6xl pl-10 pr-[20%] gap-x-4 gap-y-6'}`}
                    >
                        {introTxt.map((word, idx) => (
                            <div
                                key={idx}
                                className="h-min opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
                                style={{ animationDelay: `${idx * 0.03}s` }}
                            >
                                {word}
                            </div>
                        ))}
                    </div>


                    {projSpotlightList.length > 0 &&
                        <section
                            className={`flex flex-col gap-4 ${isMobile ? 'px-4' : 'px-10'} opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]`}
                            style={{ animationDelay: '1.5s' }}
                        >
                            <div className={`title text-3xl mb-4`}>Featured work</div>

                            {projSpotlightList.map((p, idx) => <ProjectHighlight key={idx} project={{ id: p.id, ...p.data } as ProjectType} idx={idx} />)}

                            <div className={`w-full flex text-lg`}>
                                <ArrowBtn text="See more" link="/projects" />
                            </div>
                        </section>
                    }
                </div>
            }
        </>
    )
}