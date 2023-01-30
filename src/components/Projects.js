import React, { useEffect } from 'react';
import '../css/projects.scss';

function getProjectTile() {
    // Get parent div
    var projects = document.getElementById('proj-container');

    // Get template
    var projTemplate = document.getElementById('project-template');
    var projItem = projTemplate.querySelector('.project', true);
    var projElement = document.importNode(projItem, true);

    // Populate
    projElement.querySelector('.proj-title').innerText = "Project Title";
    projElement.querySelector('.proj-subtitle').innerText = "Project description";
    projElement.querySelector('.proj-description').innerText = "This is a project description about a project. It is pretty interesting."

    // Add to DOM
    projects.appendChild(projElement);
}

export default function Project() {
    useEffect( () => {
        // Clear out projects section before populating
        document.getElementById('proj-container').innerHTML= null;
        
        for (var x = 0; x <= 1; x++) {
            getProjectTile();
        }
    });

    return(
        <div id='projects' className='body-section'>
            <h1>PROJECTS</h1>
            <div id='proj-container'></div>

            <template id='project-template'>
                <div className='project'>
                    <h4 className='proj-title'></h4>
                    <h5 className='proj-subtitle'></h5>
                    <p className='proj-description'></p>
                </div>
            </template>
        </div>
    )
};