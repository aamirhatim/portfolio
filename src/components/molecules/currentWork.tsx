import { useCallback, useEffect, useState } from "react";
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { FirestoreDocType, JobType } from "../../data/datatypes";
import { getDocumentsFromCollection } from "../../lib/firestoreLib";
import { where } from "firebase/firestore";
import useIsMobile from "../../lib/hooks/useIsMobile";
import ExpJobItem from "../atoms/ExpJobItem";

export default function CurrentWork() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const isMobile = useIsMobile();
    const [currentWork, setCurrentWork] = useState<FirestoreDocType>();

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
                <section className={`flex flex-col gap-6 border-b ${isMobile ? 'py-20' : 'pb-20'}`}>
                    <div className='title text-4xl text-(--txt-title-color) mb-8'>current role.</div>

                    <ExpJobItem job={currentWork.data as JobType} showDetail={true} />
                </section>
            }
        </>
    )
}