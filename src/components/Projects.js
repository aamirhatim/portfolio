import React, { useEffect } from 'react';
import '../css/projects.scss';

import ProjectData from '../lib/projects/project_summary.json';
import GithubIcon from '../assets/github_icon.svg';
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
    if ( p.github == null ) {
        var g = projElement.querySelector('.github-icon');
        g.classList.add('hidden');

    }
    if ( p.video == null ) {
        var v = projElement.querySelector('.video-icon');
        v.classList.add('hidden');
    }

    // Add to DOM
    projects.appendChild(projElement);
}

export default function Project() {
    useEffect( () => {
        // Clear out projects section before populating
        document.getElementById('proj-container').innerHTML= null;
        
        // Iterate through project data
        for (var p in ProjectData) {
            getProjectTile(ProjectData[p]);
        }
    });

    return(
        <div id='projects' className='body-section'>
            {/* <h1>PROJECTS</h1> */}
            <div id='proj-container'></div>

            <template id='project-template'>
                <div className='project'>
                    <div>
                        <h4 className='proj-title'></h4>
                        <h5 className='proj-subtitle'></h5>
                        <div className='proj-links'>
                            <GithubIcon className='github-icon' />
                            <VideoIcon className='video-icon' />
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