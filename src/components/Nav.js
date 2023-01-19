import React from 'react';
import '../css/nav.scss';

export default function Nav() {
    return(
        <nav>
            <div id='logo'>
                <div></div>
            </div>
            <div id='nav-spacer'></div>
            <div className='nav-link'>About</div>
            <div className='nav-link'>Skills</div>
            <div className='nav-link'>My Path</div>
            <div className='nav-link'>Projects</div>
            <div className='nav-link'>About</div>
            <div className='nav-link'>Get in Touch</div>
        </nav>
    )
};