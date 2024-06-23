import "./FooterLink.scss"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/free-regular-svg-icons'

function FooterLink( {icon, url, text}:{icon:IconDefinition, url:string, text:string} ) {
    return (
        <div className="footer-link">
            <FontAwesomeIcon icon={icon} />
            <a href={url}><p>{text}</p></a>
        </div>
    )
}

export default FooterLink