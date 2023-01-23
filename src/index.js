// import ReactDOM from 'react-dom';
import {createRoot } from 'react-dom/client';
import React from 'react';

import About from './components/About';
import Career from './components/Career';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Nav from './components/Nav';
import Projects from './components/Projects';
import Skills from './components/Skills';

import './css/index.scss';

const container = document.getElementById('app');
const root = createRoot(container);
root.render(
    <React.StrictMode>
        <Nav />
        <About />
        <Skills />
        <Career />
        <Projects />
        <Contact />
        <Footer />
    </React.StrictMode>
);