import React, { useEffect, useState } from 'react';
import About from './About';
import Career from './Career';
import Contact from './Contact';
import Footer from './Footer';
import Nav from './Nav';
import Projects from './Projects';
import Skills from './Skills';
import '../css/index.scss';
import ThemeContext from '../context/ThemeContext';

export default function App() {
    const [theme, setTheme] = useState('light');
    const applyTheme = (e) => {
        if ( theme == 'dark' ) {
            for (var i in e ) {
                e[i].classList.add('dark');
            }
        } else {
            for (var i in e ) {
                e[i].classList.remove('dark');
            }
        }
    }

    const value = {theme, setTheme, applyTheme};

    useEffect( () => {
        // Apply theme
        var themeSet = [
            Array.from(document.getElementsByTagName('h2'))
        ];
        applyTheme(themeSet.flat());
    //     var d = new Date();
    //     var h = d.getHours();
    //     if ( h >= 17 || h <= 5 ) {
    //         setTheme('dark');
    //         console.log(theme);
    //     }
    });

    return(
        <ThemeContext.Provider value={value}>
            <Nav />
            <About />
            <Skills />
            <Career />
            <Projects />
            <Contact />
            <Footer />
        </ThemeContext.Provider>
    )
};