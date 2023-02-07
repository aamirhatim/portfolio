import React from 'react';
import '../css/nav.scss';

import Logo from '../assets/aamirhatim_logo.svg';

export default function Nav() {
    return(
        <nav>
            <a href='#about'><Logo id='logo' /></a>
            <div id='nav-spacer'></div>
            <div className='nav-link'><a href='#skills'>Skills</a></div>
            <div className='nav-link'><a href='#career'>My Path</a></div>
            <div className='nav-link'><a href='#projects'>Projects</a></div>
            <div className='nav-link'><a href='#contact'>Get In Touch</a></div>
        </nav>
    )
};