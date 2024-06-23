import './Navpill.style.scss'

import Logo from '../../../assets/aamirhatim_logo.svg'
import Navbutton from '../../atoms/Navbutton/Navbutton'

function Navpill() {
    return (
        <div id='navpill'>
            <img id='logo' src={Logo}></img>
            <div id='nav-links'>
                <Navbutton label='About' />
                <Navbutton label='Skills' />
                <Navbutton label='Projects' />
                <Navbutton label='Connect' />
            </div>
        </div>
    )
}

export default Navpill