import { useEffect, useState } from 'react';
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import ExpEduItem from '../atoms/ExpEduItem'
import { EducationType, FirestoreDocType } from '../../data/datatypes';
import { getDocumentsFromCollection } from '../../lib/firestoreLib';
import { orderBy } from 'firebase/firestore';

export default function Schooling() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [eduList, setEduList] = useState<FirestoreDocType[]>([]);

    // Get list of education
    useEffect( () => {
        const getEdu = async () => {
            const edu = await getDocumentsFromCollection(firebaseAppContext, "education", [orderBy("end", "desc")]);
            if (!edu) {
                setEduList([]);
                return;
            }
            setEduList(edu);
        };
        getEdu();
    }, []);

    return (
        <section className='flex flex-col gap-20'>
            <div className='title text-4xl text-(--txt-title-color)'>education.</div>
            <div className='flex flex-col gap-10'>
                {eduList.map( (edu, idx) => <ExpEduItem key={idx} item={edu.data as EducationType} /> )}
            </div>
        </section>
    )
}