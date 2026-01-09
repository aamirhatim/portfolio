import { useCallback, useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import ChipGroup from "./ChipGroup"
import { FirestoreDocType } from "../../data/datatypes";
import { getDocumentsFromCollection } from "../../lib/firestoreLib";
import { where } from "firebase/firestore";
import useIsMobile from "../../lib/hooks/useIsMobile";
import { motion } from "motion/react";

export default function CurrentWork() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [currentWork, setCurrentWork] = useState<FirestoreDocType>();

    // Animation config
    const initial = {
        opacity: 0,
        y: 50
    }
    const whileInView = {
        opacity: 1,
        y: 0,
        transition: { duration: .2 }
    }
    const viewport = {
        once: true,
        amount: .5
    }

    // Helper to fetch current work
    const getCurrentJob = useCallback(async () => {
        const filter = where("isCurrent", "==", true);
        const currentJob = await getDocumentsFromCollection(firebaseAppContext, "jobs", [filter]);
        if (!currentJob) {
            setCurrentWork(undefined);
            return;
        }
        setCurrentWork(currentJob[0]);
    }, [firebaseAppContext, setCurrentWork]);

    // Get current work
    useEffect(() => {
        getCurrentJob();
    }, [getCurrentJob]);

    return (
        <>
            {currentWork !== undefined &&
                <motion.section
                    className={`flex flex-col gap-6 border-b ${isMobile ? 'py-20' : 'pb-20'}`}
                    initial={initial}
                    whileInView={whileInView}
                    viewport={viewport}
                >
                    <div className='title text-4xl text-(--txt-title-color) mb-10'>current role.</div>
                    <div>
                        <div className='text-md text-(--txt-subtitle-color) mb-2'>{currentWork.data.start} - Present</div>
                        <div className='text-3xl title'>{currentWork.data.title} <span className='text-(--txt-subtitle-color)'>@{currentWork.data.company}</span></div>
                    </div>
                    <div className='box-border text-xl'>{currentWork.data.summary}</div>
                    {currentWork.data.skills &&
                        <ChipGroup list={currentWork.data.skills} />
                    }
                </motion.section>
            }
        </>
    )
}