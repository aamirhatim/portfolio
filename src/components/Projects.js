import React, { useEffect } from 'react';
import '../css/projects.scss';
import ThemeContext from '../context/ThemeContext';

import ProjectData from '../lib/projects/project_summary.json';
import CodeIcon from '../assets/code_icon.svg';
import VideoIcon from '../assets/video_icon.svg';

function getProjectTile(p) {
    // Get parent div
    var projects = document.getElementById('proj-container');

    // Get template
    var projTemplate = document.getElementById('project-template');
    var projItem = projTemplate.querySelector('.project', true);
    var projElement = document.importNode(projItem, true);

    // Populate
    projElement.querySelector('.proj-title').innerText = p.title;
    projElement.querySelector('.proj-subtitle').innerText = p.subtitle;
    projElement.querySelector('.proj-description').innerText = p.description;

    if ( p.select ) {
        projElement.classList.add('select');
    }

    // Add skills
    var skills = projElement.querySelector('.proj-skills');
    for (var s in p.skills) {
        var skill = document.createElement('div');
        skill.classList.add('skill');
        skill.innerText = p.skills[s];
        skills.appendChild(skill);
    }

    // Add links
    var c = projElement.querySelector('.code-icon');
    var v = projElement.querySelector('.video-icon');
    if ( p.code == null ) {
        c.classList.add('hidden');
    } else {
        c.href = p.code;
        c.target = '_blank';
    }
    if ( p.video == null ) {
        v.classList.add('hidden');
    } else {
        v.href = p.video;
        v.target = '_blank';
    }

    // Add to DOM
    projects.appendChild(projElement);
}

export default function Project() {
    const {theme, setTheme, applyTheme} = React.useContext(ThemeContext);
    useEffect( () => {
        // Clear out projects section before populating
        document.getElementById('proj-container').innerHTML= null;
        
        // Iterate through project data
        for (var p in ProjectData) {
            getProjectTile(ProjectData[p]);
        }

        // Apply theme
        var themeSet = [
            document.getElementById('projects'),
            Array.from(document.getElementsByClassName('project')),
            Array.from(document.getElementsByClassName('skill')),
            Array.from(document.getElementsByTagName('svg'))
        ];
        applyTheme(themeSet.flat());
    });

    return(
        <div id='projects' className='body-section'>
            <h2>Selected Work</h2>
            <div id='proj-container'></div>

            <template id='project-template'>
                <div className='project'>
                    <div>
                        <h4 className='proj-title'></h4>
                        <h5 className='proj-subtitle'></h5>
                        <div className='proj-links'>
                            <a className='code-icon'><CodeIcon  /></a>
                            <a className='video-icon'><VideoIcon  /></a>
                        </div>
                        <p className='proj-description'></p>
                        <button>Read more</button>
                    </div>
                    <div className='proj-skills'></div>
                </div>
            </template>
        </div>
    )
};