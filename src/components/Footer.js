import React from 'react';
import '../css/footer.scss';

import ReactIcon from '../assets/react_logo_blk.svg';
import JSIcon from '../assets/js_logo.svg';
import HtmlIcon from '../assets/html_logo.svg';
import CssIcon from '../assets/css_logo.svg';

export default function Footer() {
    return(
        <footer>
            <div id='footer-links'></div>
            <div id='footer-badges'>
                <p>Created by Aamir Husain</p>
                <div id='footer-badge-icons'>
                    <ReactIcon className='footer-icon' />
                    <JSIcon className='footer-icon' />
                    <HtmlIcon className='footer-icon' />
                    <CssIcon className='footer-icon' />
                </div>
            </div>
        </footer>
    )
};