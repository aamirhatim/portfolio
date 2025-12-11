import { useEffect, useState } from 'react'
import { useFirebaseAppContext } from '../../context/firebaseAppContext'
import { FirestoreDocType, PatentType } from '../../data/datatypes'
import ExpPatentItem from '../atoms/ExpPatentItem'
import { getDocumentsFromCollection } from '../../lib/firestoreLib'
import { orderBy } from 'firebase/firestore'
import { motion } from 'motion/react'

export default function Patents() {
    // Get context
    const firebaseAppContext = useFirebaseAppContext();

    // Init state
    const [patentList, setPatentList] = useState<FirestoreDocType[]>([]);

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
        <>
        {patentList.length > 0 &&
            <motion.section
                className='box-border flex flex-col gap-15'
                initial={initial}
                whileInView={whileInView}
                viewport={viewport}
            >
                <div className='title text-4xl text-(--txt-title-color)'>patents.</div>
                <div className='flex flex-col gap-10'>
                    {patentList.map((p, idx) => <ExpPatentItem key={idx} item={p.data as PatentType} />)}
                </div>
            </motion.section>
        }
        </>
    )
}