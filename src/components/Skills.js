import React from 'react';
import '../css/skills.scss';

export default function Skills() {
    return(
        <div id='skills' className='body-section'>
            <div id='skills-concepts' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h2>CONCEPTS</h2>
                    <h3>I'm alwyas trying to learn new concepts and apply my skills to them while gaining new ones along the way.</h3>
                </div>
            </div>
            <div id='skills-code' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h2>CODE</h2>
                    <h3>I've picked up a handful of coding languages but my most used are Python and the web development suite (HTML/CSS/JavaScipt).</h3>
                </div>
            </div>
            <div id='skills-tools' className='skills-section'>
                <div className='skills-stickers'></div>
                <div className='skills-text'>
                    <h2>TOOLS</h2>
                    <h3>My favorite tools right now are OnShape for CAD design, React for web development and ROS for developing robotic applications.</h3>
                </div>
            </div>
        </div>
    )
};