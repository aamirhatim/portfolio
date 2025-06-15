import { Link } from '@tanstack/react-router';
import HomeButton from '../../atoms/HomeButton/homeButton';

export default function Navbar() {
    const navItems = [
        'skills',
        'experience',
        'projects',
        'connect'
    ]
    return (
        <nav className='fixed top-0 left-0 box-border w-dvw p-5'>
            <div className='w-full box-border px-6 py-3 flex border rounded-full bg-black text-l text-white'>
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