import { useEffect, useState } from 'react';
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import ExpEduItem from '../atoms/ExpEduItem'
import { EducationType, FirestoreDocType } from '../../data/datatypes';
import { getAllDocumentsFromCollection } from '../../lib/firestoreLib';

export default function Schooling() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [eduList, setEduList] = useState<FirestoreDocType[]>([]);

    // Get list of education
    useEffect( () => {
        const getEdu = async () => {
            const edu = await getAllDocumentsFromCollection(firebaseAppContext, "education");
            setEduList(edu);
        };
        getEdu();
    }, []);

    return (
        <section>
            <div className='text-4xl font-bold mb-6'>education.</div>
            <div className='flex flex-col gap-6'>
                {eduList.map( (edu, idx) => <ExpEduItem key={idx} item={edu.data as EducationType} /> )}
            </div>
        </section>
    )
}