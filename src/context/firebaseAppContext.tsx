import { FirebaseApp } from "firebase/app";
import { createContext, useContext } from "react";

interface FirebaseAppConfig {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string,
}

export const firebaseConfig: FirebaseAppConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};


export const FirebaseAppContext = createContext<FirebaseApp|null>(null);

export function useFirebaseAppContext() {
    const context = useContext(FirebaseAppContext);
    if (context === null) {
        throw new Error("Trying to access Firebase app context before it is initialized");
    }
    return context;
}