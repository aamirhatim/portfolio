import { Link } from '@tanstack/react-router'
import Logo from '../../assets/aamirhatim_logo.svg'

export default function HomeButton() {
    return (
        <Link to='/' className='flex items-center gap-4'>
            <img id='logo' className='size-[20px]' src={Logo} alt='logo' />
            <div>AAMIR HUSAIN</div>
        </Link>
    )
}