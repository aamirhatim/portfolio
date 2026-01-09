import { useCallback, useEffect, useState } from 'react';
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import ExpEduItem from '../atoms/ExpEduItem'
import { EducationType, FirestoreDocType } from '../../data/datatypes';
import { getDocumentsFromCollection } from '../../lib/firestoreLib';
import { orderBy } from 'firebase/firestore';
import AnimateInView from '../atoms/AnimateInView';

export default function Schooling() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [eduList, setEduList] = useState<FirestoreDocType[]>([]);

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
    useEffect(() => {
        getEdu();
    }, [getEdu]);

    return (
        <>
            {eduList.length > 0 &&
                <section className='flex flex-col gap-15'>
                    <AnimateInView><div className='title text-4xl text-(--txt-title-color)'>education.</div></AnimateInView>
                    <div className='flex flex-col gap-10'>
                        {eduList.map((edu, idx) => <AnimateInView key={idx}><ExpEduItem item={edu.data as EducationType} /></AnimateInView>)}
                    </div>
                </section>
            }
        </>
    )
}