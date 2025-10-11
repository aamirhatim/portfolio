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

export const firebaseConfig:FirebaseAppConfig = {
    apiKey: "AIzaSyBa1a1s7nHc82L6yWJ1mjnH8_eam56hEQw",
    authDomain: "aamirhatim-website.firebaseapp.com",
    projectId: "aamirhatim-website",
    storageBucket: "aamirhatim-website.firebasestorage.app",
    messagingSenderId: "947839834553",
    appId: "1:947839834553:web:eaeb66635284e03421be68",
    measurementId: "G-FY5N0RV03J"
};

export const FirebaseAppContext = createContext<FirebaseApp|null>(null);

export function useFirebaseAppContext() {
    const context = useContext(FirebaseAppContext);
    if (context === null) {
        throw new Error("Trying to access Firebase app context before it is initialized");
    }
    return context;
}