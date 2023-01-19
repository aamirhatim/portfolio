import React from 'react';
import '../css/career.scss';

export default function Career() {
    return(
        <div id='career' className='body-section'>
            <div className='job-template job-left'>
                <div className='spacer'>
                    <div className='job-info' style={{float: 'right'}}>
                        <div>Role</div>
                        <div>Company</div>
                        <div>Location</div>
                        <div>Duration</div>
                        <div>Details</div>
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
                        <div>Role</div>
                        <div>Company</div>
                        <div>Location</div>
                        <div>Duration</div>
                        <div>Details</div>
                    </div>
                </div>
            </div>
        </div>
    )
};