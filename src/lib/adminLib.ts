import { FirebaseApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { addDoc, collection, deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore";

// --- Authentication ---

/**
 * Authenticates an admin user using email and password.
 * @param firebaseApp The initialized Firebase application instance
 * @param email The admin email address
 * @param pass The admin password
 * @returns boolean indicating success or failure
 */
export async function loginAdmin(firebaseApp: FirebaseApp, email: string, pass: string) {
    const auth = getAuth(firebaseApp);
    try {
        await signInWithEmailAndPassword(auth, email, pass);
        return true;
    } catch (error) {
        console.error("Login failed", error);
        return false;
    }
}

/**
 * Signs out the currently authenticated admin user.
 * @param firebaseApp The initialized Firebase application instance
 */
export async function logoutAdmin(firebaseApp: FirebaseApp) {
    const auth = getAuth(firebaseApp);
    await signOut(auth);
}

/**
 * Authenticates an admin user using a Google Sign-In popup.
 * @param firebaseApp The initialized Firebase application instance
 * @returns boolean indicating success or failure
 */
export async function loginWithGoogleAdmin(firebaseApp: FirebaseApp) {
    const auth = getAuth(firebaseApp);
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        return true;
    } catch (error) {
        console.error("Google login failed", error);
        return false;
    }
}

/**
 * Checks if a specific user is an admin by querying the admins collection.
 * @param firebaseApp The initialized Firebase application instance
 * @param uid The user's UUID
 * @returns boolean indicating if the user is an admin
 */
export async function checkIsAdmin(firebaseApp: FirebaseApp, uid: string) {
    const db = getFirestore(firebaseApp);
    try {
        const adminDoc = await getDoc(doc(db, "admins", uid));
        return adminDoc.exists();
    } catch (error) {
        console.error("Error checking admin status:", error);
        return false;
    }
}

// --- CRUD Operations ---

/**
 * Creates a new document in the specified Firestore collection.
 * @param firebaseApp The initialized Firebase application instance
 * @param collectionName The name of the Firestore collection
 * @param data The payload object to save as document data
 * @returns The newly created document ID
 */
export async function createDocument(firebaseApp: FirebaseApp, collectionName: string, data: object) {
    const db = getFirestore(firebaseApp);
    try {
        const docRef = await addDoc(collection(db, collectionName), data);
        return docRef.id;
    } catch (error) {
        console.error("Error creating document:", error);
        throw error;
    }
}

/**
 * Updates an existing document in the specified Firestore collection.
 * @param firebaseApp The initialized Firebase application instance
 * @param collectionName The name of the Firestore collection
 * @param docId The ID of the document to update
 * @param data The payload object with updated fields
 * @returns boolean indicating success
 */
export async function updateDocument(firebaseApp: FirebaseApp, collectionName: string, docId: string, data: object) {
    const db = getFirestore(firebaseApp);
    try {
        const docRef = doc(db, collectionName, docId);
        await updateDoc(docRef, data);
        return true;
    } catch (error) {
        console.error("Error updating document:", error);
        throw error;
    }
}

/**
 * Deletes a document from the specified Firestore collection.
 * @param firebaseApp The initialized Firebase application instance
 * @param collectionName The name of the Firestore collection
 * @param docId The ID of the document to delete
 * @returns boolean indicating success
 */
export async function deleteDocument(firebaseApp: FirebaseApp, collectionName: string, docId: string) {
    const db = getFirestore(firebaseApp);
    try {
        const docRef = doc(db, collectionName, docId);
        await deleteDoc(docRef);
        return true;
    } catch (error) {
        console.error("Error deleting document:", error);
        throw error;
    }
}
