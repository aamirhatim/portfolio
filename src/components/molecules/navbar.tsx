import { Link } from '@tanstack/react-router'
import HomeButton from '../atoms/homeButton'
import { navItems } from '../../data/navItems'

export default function Navbar() {
    return (
        <nav className='fixed top-0 left-0 box-border w-dvw p-5'>
            <div className='w-full box-border px-6 py-3 flex border rounded-full text-l text-white backdrop-blur-md backdrop-brightness-70'>
                <HomeButton />
                <div className='flex grow justify-end gap-8 h-full'>
                    {
                        navItems.map( (n, idx) => (
                            <Link key={idx} to={n} className='content-center'>{n}</Link>
                        ))
                    }
                </div>
            </div>
        </nav>
    )
}