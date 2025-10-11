import { FirebaseApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import { FirestoreDocType } from "../data/datatypes";

/**
 * Returns list of documents from a given Firestore Collection
 * @param firebaseApp - Firebase app object
 * @param collectionName - Collection name
 * @returns List of Firestore documents
 */
export async function getAllDocumentsFromCollection(firebaseApp:FirebaseApp, collectionName:string): Promise<FirestoreDocType[]> {
    const db = getFirestore(firebaseApp);
    const querySnapshot = await getDocs(collection(db, collectionName));
    const items:FirestoreDocType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
    }));
    return items;
}