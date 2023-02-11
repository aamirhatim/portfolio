import React, { useEffect } from 'react';
import '../css/themeToggle.scss';
import ThemeContext from '../context/ThemeContext';

import SunIcon from '../assets/sun_icon.svg';
import MoonIcon from '../assets/moon_icon.svg';

export default function ToggleTheme() {
    const {theme, setTheme, applyTheme} = React.useContext(ThemeContext);

    const toggleTheme = () => {
        if ( theme == 'light' ){
            document.getElementsByTagName('svg')[1].style.width = '0';
            document.getElementsByTagName('svg')[2].style.width = '30';
            setTheme('dark');
        } else {
            document.getElementsByTagName('svg')[1].style.width = '30';
            document.getElementsByTagName('svg')[2].style.width = '0';
            setTheme('light');
        }
    }

    useEffect( () => {
        // var d = new Date();
        // var h = d.getHours();
        // if ( h >= 17 || h <= 5 ) {
        //     setTheme('dark');
        //     document.getElementsByTagName('svg')[1].style.width = '0';
        //     document.getElementsByTagName('svg')[2].style.width = '30';
        // } else {
        //     document.getElementsByTagName('svg')[1].style.width = '30';
        //     document.getElementsByTagName('svg')[2].style.width = '0';
        // }

        // Set initial values
        if ( theme == 'light' ){
            document.getElementsByTagName('svg')[1].style.width = '30';
            document.getElementsByTagName('svg')[2].style.width = '0';
        } else {
            document.getElementsByTagName('svg')[1].style.width = '0';
            document.getElementsByTagName('svg')[2].style.width = '30';
        }
    });

    return(
        <div id='theme-toggle' onClick={toggleTheme}>
            <SunIcon />
            <MoonIcon className='dark' />
        </div>
    )
};