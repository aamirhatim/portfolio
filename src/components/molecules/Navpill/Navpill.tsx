import './Navpill.style.scss'

import Logo from '../../../assets/aamirhatim_logo.svg'
import Navbutton from '../../atoms/Navbutton/Navbutton'

function Navpill() {
    return (
        <div id='navpill'>
            <img id='logo' src={Logo}></img>
            <div id='nav-links'>
                <Navbutton label='About' anchor="intro" />
                <Navbutton label='Skills' anchor="skills" />
                <Navbutton label='Projects' anchor="projects" />
                <Navbutton label='Connect' anchor="connect" />
            </div>
        </div>
    )
}

export default Navpill