import { useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import ChipGroup from "./ChipGroup"
import { FirestoreDocType } from "../../data/datatypes";
import { getDocumentsFromCollection } from "../../lib/firestoreLib";
import { where } from "firebase/firestore";
import useIsMobile from "../hooks";

export default function CurrentWork() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [currentWork, setCurrentWork] = useState<FirestoreDocType>();

    // Get current work
    useEffect( () => {
        const filter = where("isCurrent", "==", true);

        const getCurrentJob = async () => {
            const currentJob = await getDocumentsFromCollection(firebaseAppContext, "jobs", [filter]);
            setCurrentWork(currentJob[0]);
        };
        getCurrentJob();
    }, []);

    return (
        <section className={`box-border border-[var(--border-color)] p-10 ${isMobile ? 'border-b' : 'border rounded-xl'}`}>
            <div className='text-lg text-[var(--txt-subtitle-color)]'>{currentWork?.data.start} - Present</div>
            <div className='text-3xl font-bold text-[var(--txt-title-color)]'>{currentWork?.data.title} <span className='text-[var(--txt-accent-color)]'>@{currentWork?.data.company}</span></div>
            <div className='box-border mt-4 text-xl'>{currentWork?.data.summary}</div>
            {currentWork?.data.skills &&
                <div className='mt-8'>
                    <ChipGroup list={currentWork?.data.skills} />
                </div>
            }
        </section>
    )
}