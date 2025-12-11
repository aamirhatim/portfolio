import { useEffect, useState } from "react"
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { FirestoreDocType, JobType } from "../../data/datatypes"
import ExpJobItem from "../atoms/ExpJobItem"
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import { orderBy, where } from "firebase/firestore"

export default function PrevWork() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [prevWorkList, setPrevWorkList] = useState<FirestoreDocType[]>([]);

    // Get list of previous jobs
    useEffect( () => {
        const queryOptions = [
            where("isCurrent", "==", false),
            orderBy("order", "desc")
        ]

        const getPrevWork = async () => {
            const prevWork = await getDocumentsFromCollection(firebaseAppContext, "jobs", queryOptions);
            if (!prevWork) {
                setPrevWorkList([]);
                return;
            }
            setPrevWorkList(prevWork);
        };
        getPrevWork();
    }, []);

    return (
        <section className="flex flex-col gap-15">
            <div className='title text-4xl text-(--txt-title-color)'>previous roles.</div>
            <div className='flex flex-col gap-10'>
                {prevWorkList.length > 0 && prevWorkList.map((job, idx) => <ExpJobItem key={idx} job={job.data as JobType} />)}
            </div>
        </section>
    )
}