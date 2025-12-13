import { useNavigate } from 'react-router'
import Logo from '../../assets/logo.svg?react'
import { useAppContext } from '../../context/appContext'
import useIsMobile from '../../lib/hooks/useIsMobile'
import NavMenu from './NavMenu'
import SocialsBar from './socialsBar'

const navItems:string[] = [
    "about",
    "resume",
    "projects"
]

export default function Navbar() {
    // Get context
    const appContext = useAppContext()
    const isMobiile = useIsMobile();
    const navigate = useNavigate();

    // Nav handler
    const handleNavClick = (title:string) => {
        if (title === "home") {
            appContext.setNavSelect("home");
            navigate("/");
        } else {
            appContext.setNavSelect(title);
            navigate(title);
        }
    }

    const commonClasses = `fixed top-0 left-0 box-border w-dvw flex z-10 backdrop-blur-md bg-(--bg-color)/60`;

    const desktopLayout = (
        <nav className={`py-6 ${commonClasses}`}>
            <div className='box-border px-10 w-full mx-auto max-w-(--max-width) flex items-center gap-8'>
                <Logo className='cursor-pointer h-5 w-auto fill-(--txt-body-color)' onClick={() => handleNavClick("home")} />
            
                <div className='flex grow justify-start gap-8 h-full'>
                    {
                        navItems.map( (n, idx) => (
                            <div key={idx} className={`cursor-pointer px-1 py-1 content-center title text-md hover:text-(--txt-highlight-color) border-t-1 transition-colors ${appContext.navSelect.startsWith(n) ? 'text-(--txt-subtitle-color) !border-(--txt-subtitle-color)' : 'text-(--txt-subtitle-color) !border-transparent'}`} onClick={() => handleNavClick(n)}>{n}</div>
                        ))
                    }
                </div>

                <SocialsBar />
            </div>
        </nav>
    );

    const mobileLayout = (
        <nav className={`px-6 py-3 items-center justify-between ${commonClasses}`}>
            <Logo className='cursor-pointer h-5 w-auto fill-(--txt-body-color)' onClick={() => handleNavClick("home")} />
            <NavMenu />
        </nav>
    );

    return (
        <>
        { isMobiile ? mobileLayout : desktopLayout }
        </>
    )
}