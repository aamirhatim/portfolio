import { useNavigate } from 'react-router'
import Logo from '../../assets/aamirhatim_logo.svg'
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
        <nav className='box-border w-dvw fixed top-0 left-0 flex justify-center p-5 z-10'>
            <div className='w-full w-max-view box-border px-10 py-3 flex items-center gap-8 rounded-full text-l backdrop-blur-md backdrop-brightness-70 shadow-[0_0_8px_rgba(0,0,0,0.2)]'>
                <div className='cursor-pointer' onClick={() => handleNavClick("home")}><img id='logo' className='size-[22px]' src={Logo} alt='logo' /></div>
                
                <div className='flex grow justify-start gap-8 h-full'>
                    {
                        navItems.map( (n, idx) => (
                            <div key={idx} className={`cursor-pointer content-center font-bold hover:text-[var(--txt-accent-color)] transition-colors ${appContext.navSelect === n ? 'text-[var(--txt-accent-color)]' : ''}`} onClick={() => handleNavClick(n)}>{n}</div>
                        ))
                    }
                </div>

                <SocialsBar />
            </div>
        </nav>
    );

    const mobileLayout = (
        <nav className='box-border w-dvw fixed top-0 left-0 flex justify-center p-5 z-10'>
            <div className='w-full w-max-view box-border px-8 py-3 h-12 flex items-center justify-between gap-8 rounded-full backdrop-blur-md backdrop-brightness-70 shadow-[0_0_8px_rgba(0,0,0,0.2)]'>
                <div className='h-full' onClick={() => handleNavClick("home")}><img id='logo' className='h-full w-auto' src={Logo} alt='logo' /></div>
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