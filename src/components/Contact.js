import React from 'react';
import '../css/contact.scss';

import ResumeSticker from '../assets/resume_sticker.svg';
import LinkedIn from '../assets/linkedin_icon.svg';
import Github from '../assets/github_icon.svg';
import Instagram from '../assets/instagram_icon.svg';
import Blog from '../assets/blog_icon.svg';

export default function Contact() {
    return(
        <div id='contact' className='body-section'>
            <div id='contact-container'>
                <ResumeSticker id='resume-link' />
                <div id='socials'>
                    <a href='https://www.linkedin.com/in/aamirhatim/' target='_blank'><LinkedIn />The best way to reach me is through LinkedIn</a>
                    <a href='https://github.com/aamirhatim' target='_blank'><Github />Check out my work on GitHub</a>
                    <a href='https://aamirhatim.wordpress.com' target='_blank'><Blog />Read my blog from Turkey</a>
                    <a href='https://www.instagram.com/aamirhatim/' target='_blank'><Instagram />I also love photography!</a>
                </div>
            </div>
        </div>
    )
};