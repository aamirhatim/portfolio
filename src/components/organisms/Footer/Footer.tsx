import './Footer.style.scss'
import FooterLink from '../../atoms/FooterLink/FooterLink'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithub, faLinkedin, faInstagram, faReact, faJs, faSass } from '@fortawesome/free-brands-svg-icons'
import { faBlog } from '@fortawesome/free-solid-svg-icons'

function Footer() {
    return (
        <footer>
            <div>
                <h1>Connect.</h1>
                <FooterLink icon={faGithub} text="Check out my work on GitHub" />
                <FooterLink icon={faLinkedin} text="The best way to reach me is through LinkedIn" />
                <FooterLink icon={faBlog} text="Read my blog from my time abroad in Turkey" />
                <FooterLink icon={faInstagram} text="I also love photography!" />
            </div>
            <div id="signoff">
                <p>Designed by Aamir Husain. Powered by:</p>
                <FontAwesomeIcon icon={faReact} />
                <FontAwesomeIcon icon={faJs} />
                <FontAwesomeIcon icon={faSass} />
            </div>
        </footer>
    )
}

export default Footer