import { useEffect, useState } from "react";
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

    // Get current work
    useEffect( () => {
        const filter = where("isCurrent", "==", true);

        const getCurrentJob = async () => {
            const currentJob = await getDocumentsFromCollection(firebaseAppContext, "jobs", [filter]);
            if (!currentJob) {
                setCurrentWork(undefined);
                return;
            }
            setCurrentWork(currentJob[0]);
        };
        getCurrentJob();
    }, []);

    return (
        <motion.section
            className={`flex flex-col gap-6 border-b ${isMobile ? 'py-20' : 'pb-20'}`}
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
        >
            {currentWork !== undefined &&
                <>
                <div className='text-lg text-(--txt-subtitle-color)'>Current role (since {currentWork.data.start})</div>
                <div className='text-3xl title'>{currentWork.data.title} <span className='text-(--txt-subtitle-color)'>@{currentWork.data.company}</span></div>
                <div className='box-border text-xl'>{currentWork.data.summary}</div>
                {currentWork.data.skills &&
                    <ChipGroup list={currentWork.data.skills} />
                }
                </>
            }
        </motion.section>
    )
}