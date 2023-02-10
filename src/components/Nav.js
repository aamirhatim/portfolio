import React, { useEffect } from 'react';
import '../css/nav.scss';
import ThemeContext from '../context/ThemeContext';

import Logo from '../assets/aamirhatim_logo.svg';

export default function Nav() {
    const {theme, setTheme, applyTheme} = React.useContext(ThemeContext);

    var scrollHeight = 0;
    var navScrollStyle = false;

    const scrollHandle = (e) => {
        // Get height of nav bar
        const nav = document.getElementsByTagName('nav')[0];
        const navHeight = nav.getBoundingClientRect().height;
        
        // Get current scroll position
        const scrollPos = document.documentElement.scrollTop;

        // Update nav bar styling if scrolled past height
        if (scrollPos > navHeight ) {
            if ( !navScrollStyle ) {
                nav.classList.add('scrolled');
                navScrollStyle = true;
            }
        } else {
            if ( navScrollStyle ) {
                nav.classList.remove('scrolled');
                navScrollStyle = false;
            }
        }
    }

    const toggleTheme = () => {
        if ( theme == 'light' ){
            setTheme('dark');
        } else {
            setTheme('light');
        }
    }

    useEffect( () => {
        // Apply theme
        var themeSet = [
            document.getElementsByTagName('nav')[0],
            document.getElementById('logo'),
        ];
        applyTheme(themeSet.flat());

        // Set scroll height
        scrollHeight = document.documentElement.scrollTop;

        // Create window listener
        window.addEventListener('scroll', scrollHandle);

        return () => {
            window.removeEventListener('scroll', scrollHandle);
        };
    });

    return(
        <nav>
            <a href='#about'><Logo id='logo' /></a>
            <div id='nav-spacer'></div>
            <div className='nav-link'><a href='#skills'>Skills</a></div>
            <div className='nav-link'><a href='#career'>My Path</a></div>
            <div className='nav-link'><a href='#projects'>Projects</a></div>
            <div className='nav-link'><a href='#contact'>Get In Touch</a></div>
            <div className='nav-link' onClick={toggleTheme}>Theme</div>
        </nav>
    )
};