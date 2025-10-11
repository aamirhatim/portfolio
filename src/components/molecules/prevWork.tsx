import { useEffect, useState } from "react"
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { FirestoreDocType, FirestoreQueryProps, JobType } from "../../data/datatypes"
import ExpJobItem from "../atoms/ExpJobItem"
import { queryDocumentsFromCollection } from "../../lib/firestoreLib"

export default function PrevWork() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [prevWorkList, setPrevWorkList] = useState<FirestoreDocType[]>([]);

    // Get list of previous jobs
    useEffect( () => {
        const queryProps:FirestoreQueryProps = {
            fieldName: "isCurrent",
            comparison: "==",
            value: false,
        }

        const getPrevWork = async () => {
            const prevWork = await queryDocumentsFromCollection(firebaseAppContext, "jobs", queryProps);
            setPrevWorkList(prevWork);
        };
        getPrevWork();
    }, []);

    return (
        <section>
            <div className='text-4xl font-bold mb-6'>previous roles.</div>
            <div className='flex flex-col gap-10'>
                {prevWorkList.map((job, idx) => <ExpJobItem key={idx} job={job.data as JobType} />)}
            </div>
        </section>
    )
}