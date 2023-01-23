import React from 'react';
import '../css/skills.scss';

export default function Skills() {
    return(
        <div id='skills' className='body-section'>
            <div id='skills-concepts' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h1>CONCEPTS</h1>
                    <p>I'm alwyas trying to learn new concepts and apply my skills to them while gaining new ones along the way.</p>
                </div>
            </div>
            <div id='skills-code' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h1>CODE</h1>
                    <p>I've picked up a handful of coding languages but my most used are Python and the web development suite (HTML/CSS/JavaScipt).</p>
                </div>
            </div>
            <div id='skills-tools' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h1>TOOLS</h1>
                    <p>My favorite tools right now are OnShape for CAD design, React for web development and ROS for developing robotic applications.</p>
                </div>
            </div>
        </div>
    )
};