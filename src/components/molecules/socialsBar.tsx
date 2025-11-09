import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithubAlt, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { ANIMATION_DURATION_MS } from '../pages/AppLayout'

export default function SocialsBar() {
    // Set icon color to color palette
    const rootStyles = window.getComputedStyle(document.documentElement)
    const iconColor = rootStyles.getPropertyValue('--txt-color-primary').trim()

    const iconClasses = `transition-colors duration-[${ANIMATION_DURATION_MS}ms] hover:text-[var(--txt-title-color)]`

    return (
        <div className="flex justify-center gap-6">
            <a className={iconClasses} href='https://github.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faGithubAlt} size='lg' /></a>
            <a className={iconClasses} href='https://linkedin.com/in/aamirhatim' target='_blank'><FontAwesomeIcon icon={faLinkedinIn} size='lg' color={iconColor} /></a>
            <a className={iconClasses} href='https://instagram.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faInstagram} size='lg' color={iconColor} /></a>
            <a className={iconClasses} href='https://aamirhatim.wordpress.com' target='_blank'><FontAwesomeIcon icon={faPencil} size='lg' color={iconColor} /></a>
        </div>
    )
}