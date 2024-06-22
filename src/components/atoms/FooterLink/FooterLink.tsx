import "./FooterLink.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

function FooterLink( {icon, text}:{icon:IconDefinition, text:string} ) {
    return (
        <div className="footer-link">
            <FontAwesomeIcon icon={icon} />
            <p>{text}</p>
        </div>
    )
}

export default FooterLink