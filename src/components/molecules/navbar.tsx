import { useNavigate } from 'react-router'
import Logo from '../../assets/logo.svg?react'
import { useAppContext } from '../../context/appContext'
import useIsMobile from '../hooks'
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

    const desktopLayout = (
        <nav className='box-border w-dvw fixed top-0 left-0 px-10 flex justify-center z-10 backdrop-blur-md bg-(--bg-color)/60'>
            <div className='w-full w-max-view box-border py-6 flex items-center gap-8'>
                <Logo className='cursor-pointer h-5 w-auto fill-(--txt-body-color)' onClick={() => handleNavClick("home")} />
                
                <div className='flex grow justify-start gap-8 h-full'>
                    {
                        navItems.map( (n, idx) => (
                            <div key={idx} className={`cursor-pointer content-center font-bold hover:text-(--txt-accent-color) transition-colors ${appContext.navSelect.startsWith(n) ? 'text-(--txt-accent-color)' : 'text-(--txt-inactive-color)'}`} onClick={() => handleNavClick(n)}>{n}</div>
                        ))
                    }
                </div>

                <SocialsBar />
            </div>
        </nav>
    );

    const mobileLayout = (
        <nav className='box-border w-dvw fixed top-0 left-0 flex justify-center z-10 backdrop-blur-md bg-(--bg-color)/60'>
            <div className='w-full w-max-view box-border px-6 py-3 flex items-center justify-between gap-8'>
                <Logo className='cursor-pointer h-5 w-auto fill-(--txt-body-color)' onClick={() => handleNavClick("home")} />
                <NavMenu />
            </div>
        </nav>
    );

    return (
        <>
        { isMobiile ? mobileLayout : desktopLayout }
        </>
    )
}