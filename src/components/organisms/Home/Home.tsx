import { useState } from 'react'
import HomeTitle from '../../atoms/HomeTitle/HomeTitle'
import About from '../About/About'
import './Home.style.scss'
import Skills from '../Skills/Skills'
import Experience from '../Experience/Experience'
import Projects from '../Projects/Projects'
import Connect from '../Connect/Connect'
import Nav from '../../molecules/Nav/Nav'

function getContent(value: string) {
    // Reset scroll to top
    window.scrollTo(0, 0)

    switch (value) {
        case 'about':
            return <About />
        case 'skills':
            return <Skills />
        case 'experience':
            return <Experience />
        case 'projects':
            return <Projects />
        case 'connect':
            return <Connect />
    
        default:
            return <About />
    }
}

function Home() {
    const [navSelect, setNavSelect] = useState('about')

    function navToHome() {
        // Unset color for selected nav page
        const navCurrent:HTMLElement | null = document.querySelector('#nav-item-' + navSelect + ' .nav-icon')
        if (  navCurrent ) {
            navCurrent.style.color = 'unset';
        }

        // Update nave selection
        setNavSelect('about')
    }

    return (
        <div id='home'>
            <HomeTitle onClick={() => navToHome()}/>
            <Nav navSelect={navSelect} setNav={setNavSelect} />
            {getContent(navSelect)}
        </div>
    )
}

export default Home