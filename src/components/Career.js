import React, { useEffect } from 'react';
import '../css/career.scss';

import CalendarIcon from '../assets/calendar_icon.svg';
import LocationIcon from '../assets/location_icon.svg';

import JobsData from '../lib/jobs/jobs.json';

function getJobDurationString(start, end) {
    // console.log(start, end);
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

function createJobTile(job, side) {
    // Get div to insert tiles into
    var timeline = document.getElementById('timeline');

    // Get templates
    // var jobTemplate = document.getElementById('job-template');
    // var jobItem = jobTemplate.querySelector('.job', true);
    // var jobElement = document.importNode(jobItem, true);

    // var jobInfoTemplate = document.getElementById('job-info-template');
    // var jobInfoItem = jobInfoTemplate.querySelector('.job-info', true);
    // var jobInfoElement = document.importNode(jobInfoItem, true);

    var jobTemplate = document.getElementById('job-template-2');
    var jobItem = jobTemplate.querySelector('.job', true);
    var jobElement = document.importNode(jobItem, true);

    // Populate with job info
    // jobInfoElement.querySelector('.job-info-role').innerText = job.role;
    // jobInfoElement.querySelector('.job-info-company').inner = job.company;
    // jobInfoElement.querySelector('.job-info-location').innerText = job.location;

    jobElement.querySelector('.job-time').innerText = getJobDurationString(job.startDate, job.endDate);
    jobElement.querySelector('.job-role').innerText = job.role;
    jobElement.querySelector('.job-company').innerText = '@ ' + job.company;
    jobElement.querySelector('.job-location').innerText = job.location;
    jobElement.querySelector('.job-description').innerText = job.description;

    // var jobDetails = jobInfoElement.querySelector('.job-info-details');
    // for ( var d in job.details ) {
    //     var item = document.createElement('div');
    //     item.innerText = job.details[d];
    //     jobDetails.appendChild(item);
    // }

    // Add job info to correct tile side
    // var spacers = jobElement.querySelectorAll('.spacer');
    // if ( side ) { // Load on left
    //     spacers[0].appendChild(jobInfoElement);
    //     jobInfoItem.style = {"float": "right"};
    // } else { // Load on right
    //     spacers[1].appendChild(jobInfoElement);
    // }

    // Add to DOM
    timeline.appendChild(jobElement);
}

export default function Career() {
    useEffect( () => {
        // Clear out career section before populating
        document.getElementById('timeline').innerHTML = null;

        // Iterate through job entires
        var tileSide = true; // Start on the left side
        for ( var job in JobsData ) {
            createJobTile(JobsData[job], tileSide);
            tileSide = !tileSide;
        }
    });

    return(
        <div id='career' className='body-section'>
            <div>
                <div id='about-me'>
                    <h1>This is H1</h1>
                    <h2>This is H2</h2>
                    <h3>This is H3</h3>
                    <h4>This is H4</h4>
                    <h5>This is H5</h5>
                    <h6>This is H6</h6>
                    <p>This is P</p>
                </div>
                <div id='timeline'></div>
            </div>

            <template id='job-template-2'>
                <div className='job'>
                    <div className='job-img'></div>
                    <div className='job-info'>
                        <h5 className='job-time'></h5>
                        <div>
                            <h4 className='job-role'></h4>
                            <h3 className='job-company'></h3>
                        </div>
                        <h5 className='job-location'></h5>
                        <p className='job-description'></p>
                    </div>
                </div>
            </template>

            {/* <template id='job-template'>
                <div className='job'>
                    <div className='spacer'></div>
                    <div className='timeline-connector'>
                        <div className='timeline-marker'></div>
                    </div>
                    <div className='spacer'></div>
                </div>
            </template> */}

            {/* <template id='job-info-template'>
                <div className='job-info'>
                    <div className='job-title-container'>
                        <div>
                            <div className='job-info-title'>
                                <h3 className='job-info-role'></h3>
                                <h3 className='job-info-company'></h3>
                            </div>
                            <div className='job-info-container'>
                                <h4 className='job-info-location'></h4>
                            </div>
                            <div className='job-info-container'>
                                <h4 className='job-info-date'>DATE</h4>
                            </div>
                        </div>
                        <div className='job-img'></div>
                    </div>
                    
                    <div className='job-info-details'></div>
                </div>
            </template> */}
        </div>
    )
};