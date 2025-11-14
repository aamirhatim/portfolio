import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithubAlt, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import { ANIMATION_DURATION_MS } from '../pages/AppLayout'
import useIsMobile from '../hooks'

export default function SocialsBar() {
    const isMobile = useIsMobile();
    const iconClasses = isMobile
        ? `!text-[var(--txt-feature-color)]`
        : `!text-[var(--txt-feature-color)] transition-colors duration-[${ANIMATION_DURATION_MS}ms] hover:!text-[var(--txt-title-color)]`

    return (
        <div className="flex justify-center gap-6">
            <a className={iconClasses} href='https://github.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faGithubAlt} size='lg' /></a>
            <a className={iconClasses} href='https://linkedin.com/in/aamirhatim' target='_blank'><FontAwesomeIcon icon={faLinkedinIn} size='lg' /></a>
            <a className={iconClasses} href='https://instagram.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faInstagram} size='lg' /></a>
            <a className={iconClasses} href='https://aamirhatim.wordpress.com' target='_blank'><FontAwesomeIcon icon={faPencil} size='lg' /></a>
        </div>
    )
}