import { useEffect, useState } from "react";
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

    // Get current work
    useEffect(() => {
        let active = true;
        const filter = where("isCurrent", "==", true);
        getDocumentsFromCollection(firebaseAppContext, "jobs", [filter]).then((currentJob) => {
            if (!active) return;
            if (!currentJob) {
                setCurrentWork(undefined);
            } else {
                setCurrentWork(currentJob[0]);
            }
        });

        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

    return (
        <>
            {currentWork !== undefined &&
                <section className={`flex flex-col gap-6 border-b border-b-(--border-color) ${isMobile ? 'py-20' : 'pb-20'}`}>
                    <h2 className='title text-4xl text-(--txt-title-color) mb-8'>current role.</h2>

                    <ExpJobItem job={currentWork.data as JobType} showDetail={true} />
                </section>
            }
        </>
    )
}