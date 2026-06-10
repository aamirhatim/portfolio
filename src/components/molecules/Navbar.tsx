import { useNavigate } from 'react-router'
import Logo from '../../assets/logo.svg?react'
import { useAppContext } from '../../context/appContext'
import useIsMobile from '../../lib/hooks/useIsMobile'
import NavMenu from './NavMenu'
import SocialsBar from './socialsBar'

const navItems: string[] = [
    "about",
    "resume",
    "projects"
]

export default function Navbar() {
    // Get context
    const appContext = useAppContext()
    const isMobile = useIsMobile();
    const navigate = useNavigate();

    // Nav handler
    const handleNavClick = (title: string) => {
        if (title === "home") {
            appContext.setNavSelect("home");
            navigate("/");
        } else {
            appContext.setNavSelect(title);
            navigate(title);
        }
    }

    const commonClasses = `fixed left-0 box-border w-full flex z-10 backdrop-blur-md bg-(--bg-color)/60`;
    
    // Inline animation style to replicate the spring
    const animationStyle = { animation: 'slideDown 0.5s ease-out forwards' };

    const desktopLayout = (
        <div
            className={`py-6 ${commonClasses}`}
            style={animationStyle}
        >
            <nav className='box-border px-10 w-full mx-auto max-w-(--max-width) flex items-center gap-8'>
                <button aria-label="Home" className="cursor-pointer appearance-none bg-transparent border-none p-0" onClick={() => handleNavClick("home")}>
                    <Logo className='h-5 w-auto fill-(--txt-body-color)' />
                </button>

                <div className='flex grow justify-start gap-8 h-full'>
                    {
                        navItems.map((n, idx) => (
                            <button
                                key={idx}
                                aria-label={n}
                                className={`cursor-pointer appearance-none bg-transparent px-1 py-1 content-center title text-md hover:text-(--txt-highlight-color) border-t-1 transition-colors ${appContext.navSelect.startsWith(n) ? 'text-(--txt-subtitle-color) !border-(--txt-subtitle-color)' : 'text-(--txt-subtitle-color) !border-transparent'}`}
                                onClick={() => handleNavClick(n)}
                            >
                                {n}
                            </button>
                        ))
                    }
                </div>

                <SocialsBar />
            </nav>
        </div>
    );

    const mobileLayout = (
        <div
            className={`px-6 py-3 items-center justify-between ${commonClasses}`}
            style={animationStyle}
        >
            <button aria-label="Home" className="cursor-pointer appearance-none bg-transparent border-none p-0" onClick={() => handleNavClick("home")}>
                <Logo className='h-5 w-auto fill-(--txt-body-color)' />
            </button>
            <NavMenu />
        </div>
    );

    return (
        <>
            {isMobile ? mobileLayout : desktopLayout}
        </>
    )
}