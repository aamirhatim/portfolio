import { FirebaseApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, query, QueryConstraint } from "firebase/firestore";
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

/**
 * @description Fetches a single document from a Firestore collection based on its ID.
 * @param {FirebaseApp} firebaseApp The initialized Firebase application instance.
 * @param {string} collectionName The name of the Firestore collection (e.g., "projects").
 * @param {string} docId The unique ID of the document to fetch.
 * @returns {Promise<FirestoreDocType | null>} A promise that resolves to the document data 
 * (including its ID and fields) if found, or null otherwise.
 */
export async function getDocumentFromId(firebaseApp:FirebaseApp, collectionName:string, docId:string): Promise<FirestoreDocType|null> {
    const db = getFirestore(firebaseApp);
    const docRef = doc(db, collectionName, docId);

    try {
        const snapshot = await getDoc(docRef);
        if (snapshot.exists()) {
            return {
                id: snapshot.id,
                data: snapshot.data()
            } as FirestoreDocType;
        } else {
            console.warn(`No document found in '${collectionName}' with ID: ${docId}`);
            return null;
        }
    } catch (error) {
        console.error("Error getting document:", error);
        return null;
    }
}