import React from 'react';
import '../css/footer.scss';

export default function Footer() {
    return(
        <footer>
            <div id='footer-links'>
                <div>
                    <div className='footer-icon'></div>
                    <p>GitHub</p>
                </div>
                <div>
                    <div className='footer-icon'></div>
                    <p>LinkedIn</p>
                </div>
                <div>
                    <div className='footer-icon'></div>
                    <p>Instagram</p>
                </div>
            </div>
            <div id='footer-badges'>
                <p>Created by Aamir Husain</p>
                <p>Powered by</p>
                <div id='footer-badge-icons'>
                    <div className='footer-icon'></div>
                    <div className='footer-icon'></div>
                    <div className='footer-icon'></div>
                </div>
            </div>
        </footer>
    )
};