import { useEffect, useState } from 'react'
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import { FirestoreDocType, PatentType } from '../../data/datatypes'
import ExpPatentItem from '../atoms/ExpPatentItem'
import { getAllDocumentsFromCollection } from '../../lib/firestoreLib'

export default function Patents() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [patentList, setPatentList] = useState<FirestoreDocType[]>([]);

    // Get list of patents
    useEffect( () => {
        const getPatents = async () => {
            const patents = await getAllDocumentsFromCollection(firebaseAppContext, "patents");
            setPatentList(patents);
        };
        getPatents();
    }, []);
    
    return (
        <section>
            <div className='text-4xl font-bold mb-6'>patents.</div>
            <div className='flex flex-col gap-6'>
                {patentList.map((p, idx) => <ExpPatentItem key={idx} item={p.data as PatentType} />)}
            </div>
        </section>
    )
}