import { useEffect, useRef, useState, MouseEvent as ReactMouseEvent } from "react";
import { useAppContext } from "../../context/appContext";
import SocialsBar from "./socialsBar";
import { useLocation, useNavigate } from "react-router";
import { useFirebaseAppContext } from "../../context/firebaseAppContext";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { logoutAdmin } from "../../lib/adminLib";

const navItems:string[] = [
    "home",
    "about",
    "resume",
    "projects"
]

export default function NavMenu() {
    // Get context
    const appContext = useAppContext();
    const navigate = useNavigate();
    const location = useLocation();
    const firebaseApp = useFirebaseAppContext();
    const [user, setUser] = useState<User | null>(null);

    const isAdminRoute = location.pathname.startsWith('/admin');

    useEffect(() => {
        const auth = getAuth(firebaseApp);
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
        });
        return () => unsubscribe();
    }, [firebaseApp]);

    // Init state
    const [navMenuVis, setNavMenuVis] = useState<boolean>(false);
    const [navDisplay, setNavDisplay] = useState<string>(() =>
        appContext.navSelect.startsWith("projects/") ? "projects" : appContext.navSelect
    );
    const [prevNavSelect, setPrevNavSelect] = useState(appContext.navSelect);

    if (appContext.navSelect !== prevNavSelect) {
        setPrevNavSelect(appContext.navSelect);
        const nextDisplay = appContext.navSelect.startsWith("projects/") ? "projects" : appContext.navSelect;
        setNavDisplay(nextDisplay);
    }

    // Create refs
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClick = (e: ReactMouseEvent<HTMLDivElement>) => {
        e.preventDefault();

        const text = e.currentTarget.innerText;
        const path = text === "home" ? "/" : text;
        appContext.setNavSelect(text);
        navigate(path);
        setNavMenuVis(false);
    };

    // Handle clicks outside menu
    useEffect(() => {
        // Hide menu if clicked outside
        const handleOutsideClick = (event:MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setNavMenuVis(false);
            }
        };

        // Attach the event listener to the document only when the menu is visible
        if (navMenuVis) {
            document.addEventListener("mousedown", handleOutsideClick);
        };

        // Clean up the event listener when the component unmounts OR when navMenuVis changes
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [navMenuVis]);
    
    return (
        <div ref={menuRef} className="relative flex flex-col items-end">
            <div className="cursor-pointer title text-lg text-(--txt-subtitle-color)" onClick={() => setNavMenuVis(!navMenuVis)}>{navDisplay}</div>

            {navMenuVis &&
                <div className="absolute top-1 right-0 w-max px-6 pt-2 pb-4 flex flex-col items-center gap-6 rounded-lg bg-(--bg-secondary-color) shadow-xl">
                    <div className="w-full flex flex-col gap-2 items-center">
                        {isAdminRoute ? (
                            user && (
                                <div className="cursor-pointer title text-lg text-red-500 p-2" onClick={async () => {
                                    await logoutAdmin(firebaseApp);
                                    navigate("/");
                                    setNavMenuVis(false);
                                }}>Logout</div>
                            )
                        ) : (
                            navItems.map((nav, idx) => {
                                return (
                                    <div key={idx} className="cursor-pointer title text-lg text-(--txt-subtitle-color) p-2" onClick={handleClick}>{nav}</div>
                                )
                            })
                        )}
                    </div>

                    <SocialsBar />
                </div>
            }
        </div>
    );
}