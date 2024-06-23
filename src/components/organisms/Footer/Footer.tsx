import './Footer.style.scss'
import FooterLink from '../../atoms/FooterLink/FooterLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram, faReact, faJs, faSass } from '@fortawesome/free-brands-svg-icons'
import { faBlog } from '@fortawesome/free-solid-svg-icons'

function Footer() {
    return (
        <footer>
            <div className="content">
                <div>
                    <h1>Connect.</h1>
                    <FooterLink icon={faGithub} url="https://github.com/aamirhatim" text="Check out my work on GitHub" />
                    <FooterLink icon={faLinkedin} url="https://www.linkedin.com/in/aamirhatim/" text="The best way to reach me is through LinkedIn" />
                    <FooterLink icon={faBlog} url="https://aamirhatim.wordpress.com/" text="Read my blog from my time abroad in Turkey" />
                    <FooterLink icon={faInstagram} url="https://www.instagram.com/aamirhatim/" text="I also love photography!" />
                </div>
                <div id="signoff">
                    <p>Designed by Aamir Husain. Powered by:</p>
                    <FontAwesomeIcon icon={faReact} />
                    <FontAwesomeIcon icon={faJs} />
                    <FontAwesomeIcon icon={faSass} />
                </div>
            </div>
        </footer>
    )
}

export default Footer