import Logo from '../../assets/aamirhatim_logo.svg'
import { useAppContext } from '../../context/appContext'
import SocialsBar from './socialsBar'
import { Link } from 'react-router'

const navItems:Array<string> = [
    "about",
    "resume",
    "projects"
]

export default function Navbar() {
    // Get context
    const appContext = useAppContext()

    const handleHomeClick = () => {
        appContext.setNavSelect("home")
    }

    const handleNavClick = (title:string) => {
        appContext.setNavSelect(title)
    }

    return (
        <div className='box-border w-dvw p-5'>
            <div className='w-full box-border px-10 py-3 flex items-center gap-8 rounded-full text-l backdrop-blur-md backdrop-brightness-99 border-3 border-violet-950 shadow-[0_0_8px_rgba(0,0,0,0.2)]'>
                <Link to='/' onClick={handleHomeClick}><img id='logo' className='size-[22px]' src={Logo} alt='logo' /></Link>
                
                <div className='flex grow justify-start gap-8 h-full'>
                    {
                        navItems.map( (n, idx) => (
                            <Link key={idx} to={n} className={`content-center font-bold`} onClick={() => handleNavClick(n)}>{n}</Link>
                        ))
                    }
                </div>

                <SocialsBar />
            </div>
        </div>
    )
}