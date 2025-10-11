import { FirebaseApp } from "firebase/app";
import { createContext } from "react";

interface FirebaseConfig {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string,
}

export const firebaseConfig:FirebaseConfig = {
    apiKey: "AIzaSyBa1a1s7nHc82L6yWJ1mjnH8_eam56hEQw",
    authDomain: "aamirhatim-website.firebaseapp.com",
    projectId: "aamirhatim-website",
    storageBucket: "aamirhatim-website.firebasestorage.app",
    messagingSenderId: "947839834553",
    appId: "1:947839834553:web:eaeb66635284e03421be68",
    measurementId: "G-FY5N0RV03J"
};

export const FirebaseContext = createContext<FirebaseApp|null>(null);

export function useFirebaseContext() {
    if (FirebaseContext === null) {
        throw new Error("Trying to access Firebase context before it is initialized");
    }
    return FirebaseContext;
}