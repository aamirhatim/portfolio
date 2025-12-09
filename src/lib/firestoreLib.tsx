import { FirebaseApp } from "firebase/app";
import { collection, doc, getDoc, getDocs, getFirestore, query, QueryConstraint } from "firebase/firestore";
import { FirestoreDocType } from "../data/datatypes";
import { getDownloadURL, getStorage, listAll, ref } from "firebase/storage";

/**
 * Returns list of documents from a given Firestore Collection
 * @param firebaseApp - Firebase app object
 * @param collectionName - Collection name
 * @returns List of Firestore documents
 */
export async function getDocumentsFromCollection(firebaseApp:FirebaseApp, collectionName:string, queryOptions?:QueryConstraint[]): Promise<FirestoreDocType[]|null> {
    const db = getFirestore(firebaseApp);
    const q = query(
        collection(db, collectionName),
        ...(queryOptions ? queryOptions : []),
    );

    try {
        const querySnapshot = await getDocs(q);
        const items:FirestoreDocType[] = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
        }));
        return items;
    } catch (error) {
        console.error(`Error getting docs:`, error);
        return null;
    }
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

export async function getFileFromFirebaseStorage(firebaseApp:FirebaseApp, filepath:string) {
    const storage = getStorage(firebaseApp);
    const fileRef = ref(storage, filepath);
    
    // Get file URL
    let url:string;
    try {
        url = await getDownloadURL(fileRef);
    } catch (error) {
        console.error("Error getting file download url for file:", filepath);
        return null;
    }

    // Download file
    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.log("Bad response when fetching file");
            return null;
        }
        return response;
    } catch (error) {
        console.error("Error fetching file:", filepath);
        return null;
    }
}


// Load Firebase Storage image URL into cache
export async function loadImgIntoCache(firebaseApp:FirebaseApp, imgPath:string, imgCache:Map<string, string>, setImgCache:(value: React.SetStateAction<Map<string, string>>) => void) {
    const storage = getStorage(firebaseApp);
    let cache = imgCache;

    // Check image cache
    if (!cache.has(imgPath)) {
        // Get url from Firebase Storage
        try {
            const imgRefFromStorage = ref(storage, imgPath);
            const url = await getDownloadURL(imgRefFromStorage);

            // Save URL to cache
            cache.set(imgPath, url);
            setImgCache(cache);
            return url;
        } catch (error) {
            console.error("Failed to load image or get download URL:", error);
            return null;
        }
    } else {
        console.log(`Image already cached, skipping: ${imgPath}`);
        return cache.get(imgPath);
    }
}


// Returns list of file references of type StorageReference
export async function getStorageFolderReferences(firebaseApp:FirebaseApp, folderPath:string) {
    const storage = getStorage(firebaseApp);
    const folderRef = ref(storage, folderPath);
    
    try {
        const result = await listAll(folderRef);
        return result.items;
    } catch (error) {
        console.error(`Unable to get files in folder: ${folderPath}`);
        return null;
    }
}