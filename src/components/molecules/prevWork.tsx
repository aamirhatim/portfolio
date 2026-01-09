import { useCallback, useEffect, useState } from "react"
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { FirestoreDocType, JobType } from "../../data/datatypes"
import ExpJobItem from "../atoms/ExpJobItem"
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import { orderBy, where } from "firebase/firestore"
import AnimateInView from "../atoms/AnimateInView"

export default function PrevWork() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [prevWorkList, setPrevWorkList] = useState<FirestoreDocType[]>([]);

    // Helper to fetch prev work
    const getPrevWork = useCallback(async () => {
        const queryOptions = [
            where("isCurrent", "==", false),
            orderBy("order", "desc")
        ];

        const prevWork = await getDocumentsFromCollection(firebaseAppContext, "jobs", queryOptions);
        if (!prevWork) {
            setPrevWorkList([]);
            return;
        };
        setPrevWorkList(prevWork);
    }, [firebaseAppContext, setPrevWorkList]);

    // Get list of previous jobs
    useEffect(() => {
        getPrevWork();
    }, [getPrevWork]);

    return (
        <>
            {prevWorkList.length > 0 &&
                <section className="flex flex-col gap-15">
                    <AnimateInView><div className='title text-4xl text-(--txt-title-color)'>previous roles.</div></AnimateInView>
                    <div className='flex flex-col gap-10'>
                        {prevWorkList.map((job, idx) => <AnimateInView key={idx}><ExpJobItem job={job.data as JobType} /></AnimateInView>)}
                    </div>
                </section>
            }
        </>
    )
}