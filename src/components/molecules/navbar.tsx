import { Link } from '@tanstack/react-router'
import Logo from '../../assets/aamirhatim_logo.svg'
import { navItems } from '../../data/navItems'
import SocialsBar from './socialsBar'
import { Route } from '../../routes/__root'

export default function Navbar() {
    // Get context
    const routeContext = Route.useRouteContext()

    const handleHomeClick = () => {
        routeContext.setNav('')
    }

    const handleNavClick = (title:string) => {
        routeContext.setNav(title)
    }

    return (
        <div className='box-border w-dvw p-5'>
            <div className='w-full box-border px-10 py-3 flex items-center gap-8 rounded-full text-l backdrop-blur-md backdrop-brightness-99 shadow-[0_0_8px_rgba(0,0,0,0.1)]'>
                <Link to='/' onClick={handleHomeClick}><img id='logo' className='size-[22px]' src={Logo} alt='logo' /></Link>
                
                <div className='flex grow justify-end gap-8 h-full'>
                    {
                        navItems.map( (n, idx) => {
                            let navColor = 'black'
                            if (routeContext.nav === n) {
                                navColor = 'white'
                            }

                            return (
                                <Link key={idx} to={n} className={`content-center font-bold text-${navColor}`} onClick={() => handleNavClick(n)}>{n}</Link>
                            )
                        })
                    }
                </div>

                <SocialsBar />
            </div>
        </div>
    )
}