import ProjectHighlight from "../molecules/projectHighlight"
import ArrowBtn from '../atoms/ArrowBtn'
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { useCallback, useEffect, useState } from "react"
import { FirestoreDocType, ProjectType } from "../../data/datatypes"
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import { where } from "firebase/firestore"
import useIsMobile from "../../lib/hooks/useIsMobile"
import { motion, stagger, Transition } from "motion/react"
import ScrollHint from "../atoms/ScrollHint"

export default function HomePage() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [introTxt, setIntroTxt] = useState<string[]>([]);
    const [projSpotlightList, setProjSpotlightList] = useState<FirestoreDocType[]>([]);

    // Fetch intro text
    const getIntroTxt = useCallback(async () => {
        const txt = await getDocumentsFromCollection(firebaseAppContext, "intro");
        if (!txt) {
            setIntroTxt([]);
            return;
        }
        const words = txt[0].data.text.split(" ");
        setIntroTxt(words);
    }, [setIntroTxt]);

    // Fetch spotlight projects
    const getSpotlights = useCallback(async () => {
        const filter = where("spotlight", "==", true);

        const spotlights = await getDocumentsFromCollection(firebaseAppContext, "projects", [filter]);
        if (!spotlights) {
            setProjSpotlightList([]);
            return;
        }
        setProjSpotlightList(spotlights);
    }, [setProjSpotlightList]);

    // Get intro and projects
    useEffect(() => {
        getIntroTxt();
        getSpotlights();
    }, [getIntroTxt, getSpotlights]);

    // Animation config
    const containerTransition: Transition = {
        delayChildren: stagger(0.03)
    };
    const childTransition: Transition = {
        duration: 0.75,
        ease: "easeOut"
    }
    const container = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: containerTransition
        }
    };
    const child = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: childTransition
        }
    };

    return (
        <>
            {introTxt.length > 0 &&
                <div className="box-border flex flex-col w-full gap-5">
                    <div className="relative h-(--outlet-height) flex flex-col items-center justify-between">
                        <motion.div
                            className={`box-border feature w-full h-full flex flex-wrap content-start text-(--txt-feature-color) ${isMobile ? 'text-5xl px-4 gap-x-3 gap-y-2' : 'text-6xl pl-10 pr-[20%] gap-x-4 gap-y-6'}`}
                            variants={container}
                            initial="hidden"
                            animate="visible"
                        >
                            {introTxt.map((word, idx) => (
                                <motion.div
                                    key={idx}
                                    className="h-min"
                                    variants={child}
                                >
                                    {word}
                                </motion.div>
                            ))}
                        </motion.div>

                        <div className="box-border pb-10">
                            <ScrollHint classname="text-(--txt-subtitle-color)" />
                        </div>
                    </div>


                    {projSpotlightList.length > 0 &&
                        <motion.section
                            className="flex flex-col gap-8"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: .15 }}
                            transition={{ duration: .5, type: "spring", bounce: .3 }}
                        >
                            <div className={`title text-3xl ${isMobile ? 'px-4' : 'px-10'}`}>Featured work</div>
                            <div className={`flex flex-col gap-4`}>
                                {projSpotlightList.map((p, idx) => <ProjectHighlight key={idx} project={{ id: p.id, ...p.data } as ProjectType} idx={idx} />)}
                            </div>

                            <motion.div
                                className={`w-full flex text-lg ${isMobile ? 'px-4' : 'px-10'}`}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: .5 }}
                            >
                                <ArrowBtn text="See more" link="/projects" />
                            </motion.div>
                        </motion.section>
                    }
                </div>
            }
        </>
    )
}