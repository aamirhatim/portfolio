import React from 'react';
import '../css/about.scss';

import intro from '../lib/intro.html';

export default function About() {
    return(
        <div id='about' className='body-section'>
            <div id='about-container'>
                <h1 id='about-header'>Hey, I'm Aamir.</h1>
                <div id='about-img'></div>
                <h2 id='about-info' dangerouslySetInnerHTML={{__html: intro}}></h2>
            </div>
        </div>
    )
};