import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithubAlt, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

export default function SocialsBar() {
    // Set icon color to color palette
    const rootStyles = window.getComputedStyle(document.documentElement)
    const iconColor = rootStyles.getPropertyValue('--txt-color-primary').trim()

    return (
        <div className="flex justify-center gap-6">
            <a href='https://github.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faGithubAlt} size='lg' color={iconColor} /></a>
            <a href='https://linkedin.com/in/aamirhatim' target='_blank'><FontAwesomeIcon icon={faLinkedinIn} size='lg' color={iconColor} /></a>
            <a href='https://instagram.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faInstagram} size='lg' color={iconColor} /></a>
            <a href='https://aamirhatim.wordpress.com' target='_blank'><FontAwesomeIcon icon={faPencil} size='lg' color={iconColor} /></a>
        </div>
    )
}