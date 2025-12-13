import { useCallback, useEffect, useState } from 'react';
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import ExpEduItem from '../atoms/ExpEduItem'
import { EducationType, FirestoreDocType } from '../../data/datatypes';
import { getDocumentsFromCollection } from '../../lib/firestoreLib';
import { orderBy } from 'firebase/firestore';
import { motion } from 'motion/react';

export default function Schooling() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [eduList, setEduList] = useState<FirestoreDocType[]>([]);

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

    // Helper to fetch school items
    const getEdu = useCallback(async () => {
        const edu = await getDocumentsFromCollection(firebaseAppContext, "education", [orderBy("end", "desc")]);
        if (!edu) {
            setEduList([]);
            return;
        }
        setEduList(edu);
    }, [firebaseAppContext, setEduList]);

    // Get list of education
    useEffect( () => {
        getEdu();
    }, [getEdu]);

    return (
        <>
        {eduList.length > 0 &&
            <motion.section
                className='flex flex-col gap-15'
                initial={initial}
                whileInView={whileInView}
                viewport={viewport}
            >
                <div className='title text-4xl text-(--txt-title-color)'>education.</div>
                <div className='flex flex-col gap-10'>
                    {eduList.map( (edu, idx) => <ExpEduItem key={idx} item={edu.data as EducationType} /> )}
                </div>
            </motion.section>
        }
        </>
    )
}