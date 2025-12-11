import { useEffect, useState } from 'react'
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import { FirestoreDocType, PatentType } from '../../data/datatypes'
import ExpPatentItem from '../atoms/ExpPatentItem'
import { getDocumentsFromCollection } from '../../lib/firestoreLib'
import { orderBy } from 'firebase/firestore'

export default function Patents() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [patentList, setPatentList] = useState<FirestoreDocType[]>([]);

    // Get list of patents
    useEffect( () => {
        const getPatents = async () => {
            const patents = await getDocumentsFromCollection(firebaseAppContext, "patents", [orderBy("status")]);
            if (!patents) {
                setPatentList([]);
                return;
            }
            setPatentList(patents);
        };
        getPatents();
    }, []);
    
    return (
        <section className='box-border flex flex-col gap-15'>
            {patentList.length > 0 &&
                <>
                <div className='title text-4xl text-(--txt-title-color)'>patents.</div>
                <div className='flex flex-col gap-10'>
                    {patentList.map((p, idx) => <ExpPatentItem key={idx} item={p.data as PatentType} />)}
                </div>
                </>
            }
        </section>
    )
}