import "./FooterLink.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

function FooterLink( {icon, url, text}:{icon:IconDefinition, url:string, text:string} ) {
    return (
        <div className="footer-link">
            <FontAwesomeIcon icon={icon} />
            <p><a href={url}>{text}</a></p>
        </div>
    )
}

export default FooterLink