import { FirebaseApp } from "firebase/app";
import { collection, getDocs, getFirestore, query, QueryConstraint, where } from "firebase/firestore";
import { FirestoreDocType, FirestoreQueryProps } from "../data/datatypes";

/**
 * Returns list of documents from a given Firestore Collection
 * @param firebaseApp - Firebase app object
 * @param collectionName - Collection name
 * @returns List of Firestore documents
 */
export async function getAllDocumentsFromCollection(firebaseApp:FirebaseApp, collectionName:string, queryOptions?:QueryConstraint[]): Promise<FirestoreDocType[]> {
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

/**
 * Gets documents from a specified Collection using a provided query
 * @param firebaseApp - Firebase app object
 * @param collectionName - Collection name
 * @param queryProps - Query props of type FirestoreQueryProps
 * @returns List of Firestore documents that match query
 */
export async function queryDocumentsFromCollection(firebaseApp:FirebaseApp, collectionName:string, queryProps:FirestoreQueryProps): Promise<FirestoreDocType[]> {
    const db = getFirestore(firebaseApp);
    const q = query(collection(db, collectionName), where(queryProps.fieldName, queryProps.comparison, queryProps.value));
    const querySnapshot = await getDocs(q);
    const items:FirestoreDocType[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
    }));
    return items;
}