import React from 'react';
import '../css/skills.scss';

import concepts from '../lib/concepts.html';
import code from '../lib/code.html';
import tools from '../lib/tools.html';

import ConceptsStickers from '../assets/concepts_stickers.svg';
import CodeStickers from '../assets/code_stickers.svg';
import ToolStickers from '../assets/tool_stickers.svg';

export default function Skills() {
    return(
        <div id='skills' className='body-section'>
            <div className='skills-section'>
                <ConceptsStickers />
                <div className='skills-text'>
                    <h2>CONCEPTS</h2>
                    <h3 dangerouslySetInnerHTML={{__html: concepts}}></h3>
                </div>
            </div>
            <div className='skills-section'>
                <CodeStickers />
                <div className='skills-text'>
                    <h2>CODE</h2>
                    <h3 dangerouslySetInnerHTML={{__html: code}}></h3>
                </div>
            </div>
            <div className='skills-section'>
                <ToolStickers />
                <div className='skills-text'>
                    <h2>TOOLS</h2>
                    <h3 dangerouslySetInnerHTML={{__html: tools}}></h3>
                </div>
            </div>
        </div>
    )
};