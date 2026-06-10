import { useEffect, useState } from 'react';
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

    // Get list of education
    useEffect(() => {
        let active = true;
        getDocumentsFromCollection(firebaseAppContext, "education", [orderBy("end", "desc")]).then((edu) => {
            if (!active) return;
            if (!edu) {
                setEduList([]);
            } else {
                setEduList(edu);
            }
        });

        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

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