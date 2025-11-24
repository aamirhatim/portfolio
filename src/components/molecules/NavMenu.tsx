import { useEffect, useRef, useState } from "react";
import { useAppContext } from "../../context/appContext";
import SocialsBar from "./socialsBar";
import { useNavigate } from "react-router";

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

    // Init state
    const [navMenuVis, setNavMenuVis] = useState<boolean>(false);
    const [navDisplay, setNavDisplay] = useState<string>("");

    // Create refs
    const menuRef = useRef<HTMLDivElement>(null);

    const handleClick = (e:any) => {
        e.preventDefault();

        const path = e.target.innerText === "home" ? "/" : e.target.innerText
        appContext.setNavSelect(e.target.innerText);
        navigate(path);
        setNavMenuVis(false);
    };

    // Handle nav indicator formatting
    useEffect(() => {
        if (appContext.navSelect.startsWith("projects/")) {
            setNavDisplay("projects");
        } else {
            setNavDisplay(appContext.navSelect);
        }
    }, [appContext.navSelect]);

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
            <div className="font-bold text-[var(--txt-accent-color)]" onClick={() => setNavMenuVis(!navMenuVis)}>{navDisplay}</div>

            {navMenuVis &&
                <div className="absolute top-full right-0 w-max mt-6 p-6 flex flex-col items-center gap-4 rounded-xl bg-[var(--bg-layer-color)] shadow-2xl">
                    {navItems.map((nav, idx) => {
                        return (
                            <div key={idx} className="font-bold text-lg text-[var(--txt-feature-color)] p-2" onClick={handleClick}>{nav}</div>
                        )
                    })}

                    <div className="mt-4">
                        <SocialsBar />
                    </div>
                </div>
            }
        </div>
    );
}