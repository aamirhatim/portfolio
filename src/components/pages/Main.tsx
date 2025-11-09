import { useMemo, useState } from "react"
import { AppContext, AppContextInterface } from "../../context/appContext"
import { FirebaseApp, initializeApp } from "firebase/app";
import { firebaseConfig, FirebaseAppContext } from "../../context/firebaseAppContext"
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore"
import { connectStorageEmulator, getStorage } from "firebase/storage"
import AppLayout from "./AppLayout";

export default function Main() {
    // Init state
    const [nav, setNav] = useState<string>(sessionStorage.getItem("navSelect") || "home");

    // Init context
    const initContext:AppContextInterface = {
        navSelect: nav,
        setNavSelect: setNav
    }

    // Init Firebase app
    const firebaseApp:FirebaseApp = useMemo(() => {
        const isLocal:boolean = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
        const app = initializeApp(firebaseConfig);

        if (isLocal) {
            console.warn("Running locally. Connecting to emulators");
            connectFirestoreEmulator(getFirestore(app), "127.0.0.1", 5001);
            connectStorageEmulator(getStorage(app), "127.0.0.1", 5002);
        };

        return app;
    }, []);    

    return (
        <FirebaseAppContext.Provider value={firebaseApp}>
            <AppContext.Provider value={initContext}>
                <AppLayout />
            </AppContext.Provider>
        </FirebaseAppContext.Provider>
    )
}