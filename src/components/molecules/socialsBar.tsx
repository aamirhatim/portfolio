import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithubAlt, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import useIsMobile from '../hooks'
import { ANIMATION_DURATION_MS } from '../../data/constants';

export default function SocialsBar() {
    const isMobile = useIsMobile();
    const iconClasses = isMobile
        ? `!text-(--txt-subtitle-color)`
        : `!text-(--txt-subtitle-color) transition-colors duration-[${ANIMATION_DURATION_MS}ms] hover:!text-(--txt-accent-color)`

    return (
        <div className="flex justify-center gap-6">
            <a className={iconClasses} href='https://github.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faGithubAlt} size='lg' /></a>
            <a className={iconClasses} href='https://linkedin.com/in/aamirhatim' target='_blank'><FontAwesomeIcon icon={faLinkedinIn} size='lg' /></a>
            <a className={iconClasses} href='https://instagram.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faInstagram} size='lg' /></a>
            <a className={iconClasses} href='https://aamirhatim.wordpress.com' target='_blank'><FontAwesomeIcon icon={faPencil} size='lg' /></a>
        </div>
    )
}