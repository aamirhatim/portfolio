import { useEffect, useState } from "react"
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

    // Get list of previous jobs
    useEffect(() => {
        let active = true;
        const queryOptions = [
            where("isCurrent", "==", false),
            orderBy("order", "desc")
        ];

        getDocumentsFromCollection(firebaseAppContext, "jobs", queryOptions).then((prevWork) => {
            if (!active) return;
            if (!prevWork) {
                setPrevWorkList([]);
            } else {
                setPrevWorkList(prevWork);
            }
        });

        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

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