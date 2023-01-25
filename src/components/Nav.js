import React from 'react';
import '../css/nav.scss';

import Logo from '../assets/aamirhatim_logo.svg';

export default function Nav() {
    return(
        <nav>
            <Logo id='logo' />
            <div id='nav-spacer'></div>
            <div className='nav-link'>Skills</div>
            <div className='nav-link'>My Path</div>
            <div className='nav-link'>Projects</div>
            <div className='nav-link'>Get in Touch</div>
        </nav>
    )
};