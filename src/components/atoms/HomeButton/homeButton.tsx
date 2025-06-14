import { Link } from '@tanstack/react-router'
import Logo from '../../../assets/aamirhatim_logo.svg'

export default function HomeButton() {
    return (
        <div id="home-btn">
            <Link to="/">
                <img id="logo" src={Logo} alt="logo" />
                <h1>AAMIR HUSAIN</h1>
            </Link>
        </div>
    )
}