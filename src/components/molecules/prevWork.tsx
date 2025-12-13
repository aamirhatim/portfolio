import { useCallback, useEffect, useState } from "react"
import { useFirebaseAppContext } from "../../context/firebaseAppContext"
import { FirestoreDocType, JobType } from "../../data/datatypes"
import ExpJobItem from "../atoms/ExpJobItem"
import { getDocumentsFromCollection } from "../../lib/firestoreLib"
import { orderBy, where } from "firebase/firestore"
import { motion } from "motion/react"

export default function PrevWork() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [prevWorkList, setPrevWorkList] = useState<FirestoreDocType[]>([]);

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
        amount: .1
    }

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
    useEffect( () => {
        getPrevWork();
    }, [getPrevWork]);

    return (
        <>
        {prevWorkList.length > 0 &&
            <motion.section
                className="flex flex-col gap-15"
                initial={initial}
                whileInView={whileInView}
                viewport={viewport}
            >
                <div className='title text-4xl text-(--txt-title-color)'>previous roles.</div>
                <div className='flex flex-col gap-10'>
                    {prevWorkList.map((job, idx) => <ExpJobItem key={idx} job={job.data as JobType} />)}
                </div>
            </motion.section>
        }
        </>
    )
}