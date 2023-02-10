import React, { useEffect } from 'react';
import '../css/skills.scss';
import ThemeContext from '../context/ThemeContext';

import concepts from '../lib/skills/concepts.html';
import code from '../lib/skills/code.html';
import tools from '../lib/skills/tools.html';

import ConceptsStickers from '../assets/concepts_stickers.svg';
import CodeStickers from '../assets/code_stickers.svg';
import ToolStickers from '../assets/tool_stickers.svg';

export default function Skills() {
    const {theme, setTheme, applyTheme} = React.useContext(ThemeContext);
    useEffect( () => {
        // Apply theme
        var themeSet = [
            document.getElementById('skills'),
            Array.from(document.getElementsByClassName('skills-stickers'))
        ];
        applyTheme(themeSet.flat(Infinity));
    });

    return(
        <div id='skills' className='body-section'>
            <div className='skills-section'>
                <ConceptsStickers className='skills-stickers' />
                <div className='skills-text'>
                    <h2>Concepts</h2>
                    <h3 dangerouslySetInnerHTML={{__html: concepts}}></h3>
                </div>
            </div>
            <div className='skills-section'>
                <CodeStickers className='skills-stickers' />
                <div className='skills-text'>
                    <h2>Code</h2>
                    <h3 dangerouslySetInnerHTML={{__html: code}}></h3>
                </div>
            </div>
            <div className='skills-section'>
                <ToolStickers className='skills-stickers' />
                <div className='skills-text'>
                    <h2>Tools</h2>
                    <h3 dangerouslySetInnerHTML={{__html: tools}}></h3>
                </div>
            </div>
        </div>
    )
};