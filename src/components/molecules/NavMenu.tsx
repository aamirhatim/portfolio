import { useState } from "react";
import { useAppContext } from "../../context/appContext";
import SocialsBar from "./socialsBar";

const navItems:string[] = [
    "home",
    "about",
    "resume",
    "projects"
]

export default function NavMenu() {
    // Get context
    const appContext = useAppContext();

    // Init state
    const [navMenuVis, setNavMenuVis] = useState<boolean>(false);

    const handleClick = (e:any) => {
        e.preventDefault();

        appContext.setNavSelect(e.target.innerText);
        setNavMenuVis(false);
    };
    
    return (
        <div className="relative flex flex-col items-end">
            <div className="font-bold text-[var(--txt-accent-color)]" onClick={() => setNavMenuVis(!navMenuVis)}>{appContext.navSelect}</div>

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