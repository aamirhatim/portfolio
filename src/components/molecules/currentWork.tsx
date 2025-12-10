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
            if (!currentJob) {
                setCurrentWork(undefined);
                return;
            }
            setCurrentWork(currentJob[0]);
        };
        getCurrentJob();
    }, []);

    return (
        <section className={`flex flex-col gap-6 border-b ${isMobile ? 'py-20' : 'pb-20'}`}>
            <div className='text-lg text-(--txt-subtitle-color)'>Current role (since {currentWork?.data.start})</div>
            <div className='text-3xl title text-(--txt-title-color)'>{currentWork?.data.title} <span className='text-(--txt-accent-color)'>@{currentWork?.data.company}</span></div>
            <div className='box-border text-xl'>{currentWork?.data.summary}</div>
            {currentWork?.data.skills &&
                <ChipGroup list={currentWork?.data.skills} />
            }
        </section>
    )
}