import { useEffect, useState } from 'react'
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import { FirestoreDocType, PatentType } from '../../data/datatypes'
import ExpPatentItem from '../atoms/ExpPatentItem'
import { getDocumentsFromCollection } from '../../lib/firestoreLib'
import { orderBy } from 'firebase/firestore'
import AnimateInView from '../atoms/AnimateInView'

export default function Patents() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [patentList, setPatentList] = useState<FirestoreDocType[]>([]);

    // Get list of patents
    useEffect(() => {
        let active = true;
        getDocumentsFromCollection(firebaseAppContext, "patents", [orderBy("status")]).then((patents) => {
            if (!active) return;
            if (!patents) {
                setPatentList([]);
            } else {
                setPatentList(patents);
            }
        });

        return () => {
            active = false;
        };
    }, [firebaseAppContext]);

    return (
        <>
            {patentList.length > 0 &&
                <section className='box-border flex flex-col gap-15'>
                    <AnimateInView><div className='title text-4xl text-(--txt-title-color)'>patents.</div></AnimateInView>
                    <div className='flex flex-col gap-10'>
                        {patentList.map((p, idx) => <AnimateInView key={idx}><ExpPatentItem item={p.data as PatentType} /></AnimateInView>)}
                    </div>
                </section>
            }
        </>
    )
}