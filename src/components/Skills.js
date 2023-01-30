import React from 'react';
import '../css/skills.scss';

import concepts from '../lib/concepts.html';
import code from '../lib/code.html';
import tools from '../lib/tools.html';

export default function Skills() {
    return(
        <div id='skills' className='body-section'>
            <div id='skills-concepts' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h2>CONCEPTS</h2>
                    <h3 dangerouslySetInnerHTML={{__html: concepts}}></h3>
                </div>
            </div>
            <div id='skills-code' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h2>CODE</h2>
                    <h3 dangerouslySetInnerHTML={{__html: code}}></h3>
                </div>
            </div>
            <div id='skills-tools' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h2>TOOLS</h2>
                    <h3 dangerouslySetInnerHTML={{__html: tools}}></h3>
                </div>
            </div>
        </div>
    )
};