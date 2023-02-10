import React, { useEffect } from 'react';
import '../css/career.scss';
import ThemeContext from '../context/ThemeContext';

import JobsData from '../lib/career/jobs.json';
import EducationData from '../lib/career/education.json';
import aboutMe from '../lib/career/about_me.html';
import GradSticker from '../assets/grad_sticker.svg';

function getJobDurationString(start, end) {
    var duration;
    var endString;
    duration = start.month + ' ' + start.year;

    if ( end.month != null ) {
        endString = ' - ' + end.month + ' ' + end.year;
        duration = duration.concat([endString]);
    } else {
        endString = ' - Now';
        duration = duration.concat([endString]);
    }

    return duration;
}

function createJobTile(job) {
    // Get div to insert tiles into
    var timeline = document.getElementById('timeline');

    // Get templates
    var jobTemplate = document.getElementById('job-template-2');
    var jobItem = jobTemplate.querySelector('.job', true);
    var jobElement = document.importNode(jobItem, true);

    // Populate with job info
    jobElement.querySelector('.job-time').innerText = getJobDurationString(job.startDate, job.endDate);
    jobElement.querySelector('.job-role').innerText = job.role;
    jobElement.querySelector('.job-company').innerText = '@ ' + job.company;
    jobElement.querySelector('.job-location').innerText = job.location;
    jobElement.querySelector('.job-description').innerText = job.description;

    // Add to DOM
    timeline.appendChild(jobElement);
}

function getEducation(edu) {
    // Get parent div
    var education = document.getElementById('education');

    // Get template
    var eduTemplate = document.getElementById('education-template');
    var eduItem = eduTemplate.querySelector('.education-item', true);
    var eduElement = document.importNode(eduItem, true);

    // Populate
    eduElement.querySelector('.degree').innerText = edu.degree;
    eduElement.querySelector('.school').innerText = edu.school + ', ' + edu.year;

    // Add to DOM
    education.appendChild(eduElement);
}

export default function Career() {
    const {theme, setTheme, applyTheme} = React.useContext(ThemeContext);
    useEffect( () => {
        // Clear out career sections before populating
        document.getElementById('timeline').innerHTML = null;
        document.getElementById('education').innerHTML = null;

        // Apply theme
        var themeSet = [
            document.getElementById('career'),
            Array.from(document.getElementsByClassName('skills-stickers')),
            document.getElementById('education')
        ];
        applyTheme(themeSet.flat(Infinity));

        // Iterate through job entires
        for ( var job in JobsData ) {
            createJobTile(JobsData[job]);
        }

        // Iterate through education entries
        for ( var edu in EducationData ) {
            getEducation(EducationData[edu]);
        }
    });

    return(
        <div id='career' className='body-section'>
            <div>
                <div id='about-me'>
                    <h2>My Path</h2>
                    <div dangerouslySetInnerHTML={{__html: aboutMe}}></div>
                    <div id='education-container'>
                        <GradSticker />
                        <div id='education'></div>
                    </div>
                </div>
                <div id='timeline'></div>
            </div>

            <template id='education-template'>
                <div className='education-item'>
                    <h4 className='degree'></h4>
                    <h5 className='school'></h5>
                </div>
            </template>

            <template id='job-template-2'>
                <div className='job'>
                    <div className='job-info'>
                        <h4 className='job-role'></h4>
                        <h3 className='job-company'></h3>
                        <h5 className='job-time'></h5>
                        <h5 className='job-location'></h5>
                        <p className='job-description'></p>
                    </div>
                </div>
            </template>
        </div>
    )
};