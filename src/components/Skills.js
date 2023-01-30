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
                    <div dangerouslySetInnerHTML={{__html: concepts}}></div>
                </div>
            </div>
            <div id='skills-code' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h2>CODE</h2>
                    <div dangerouslySetInnerHTML={{__html: code}}></div>
                </div>
            </div>
            <div id='skills-tools' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h2>TOOLS</h2>
                    <div dangerouslySetInnerHTML={{__html: tools}}></div>
                </div>
            </div>
        </div>
    )
};