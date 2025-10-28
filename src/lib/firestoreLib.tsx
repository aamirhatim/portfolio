import { FirebaseApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, QueryConstraint } from "firebase/firestore";
import { FirestoreDocType } from "../data/datatypes";

/**
 * Returns list of documents from a given Firestore Collection
 * @param firebaseApp - Firebase app object
 * @param collectionName - Collection name
 * @returns List of Firestore documents
 */
export async function getDocumentsFromCollection(firebaseApp:FirebaseApp, collectionName:string, queryOptions?:QueryConstraint[]): Promise<FirestoreDocType[]> {
    const db = getFirestore(firebaseApp);
    const q = query(
        collection(db, collectionName),
        ...(queryOptions ? queryOptions : []),
    );
    const querySnapshot = await getDocs(q);
    const items:FirestoreDocType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
    }));
    return items;
}