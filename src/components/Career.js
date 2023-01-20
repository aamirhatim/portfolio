import React from 'react';
import '../css/career.scss';

import CalendarIcon from '../assets/calendar_icon.svg';
import LocationIcon from '../assets/location_icon.svg';

// const yaml = require('js-yaml');
// const fs = require('fs');

try {
    // var client = new XMLHttpRequest();
    // client.open('GET', 'lib/jobs/verizon.yaml');
    // client.onreadystatechange = function() {
    //     console.log(client.responseText);
    // }
    // client.send();
    
    // const doc = yaml.load(fs.readFileSync('/src/lib/jobs/verizon.yaml', 'utf-8'));
    // console.log(doc);
} catch (e) {
    console.log(e);
}

export default function Career() {
    return(
        <div id='career' className='body-section'>
            <div className='job-template job-left'>
                <div className='spacer'>
                    <div className='job-info' style={{float: 'right'}}>
                        <div className='job-info-title'>
                            <h3 className='job-info-role'>Robotics Architect @<span className='job-info-company'>Verizon</span></h3>
                        </div>
                        <div className='job-info-container'>
                            <LocationIcon />
                            <h4>New Jersey</h4>
                        </div>
                        <div className='job-info-container'>
                            <CalendarIcon />
                            <h4>2019-Now</h4>
                        </div>
                        <div className='job-info-details'>Details</div>
                    </div>
                </div>
                <div className='timeline-connector'>
                    <div className='timeline-marker'></div>
                </div>
                <div className='spacer'></div>
            </div>
            <div className='job-template job-right'>
                <div className='spacer'></div>
                <div className='timeline-connector'>
                    <div className='timeline-marker'></div>
                </div>
                <div className='spacer'>
                    <div className='job-info'>
                        <div className='job-info-title'>
                            <h3 className='job-info-role'>Robotics Architect @<span clasName='job-info-company'>Verizon</span></h3>
                        </div>
                        <div className='job-info-container'>
                            <LocationIcon />
                            <h4>New Jersey</h4>
                        </div>
                        <div className='job-info-container'>
                            <CalendarIcon />
                            <h4>2019-Now</h4>
                        </div>
                        <div className='job-info-details'>Details</div>
                    </div>
                </div>
            </div>
        </div>
    )
};