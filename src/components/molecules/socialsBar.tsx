import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithubAlt, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

export default function SocialsBar() {
    return (
        <div className="fixed right-5 bottom-5 box-border px-8 py-4 rounded-full backdrop-blur-md backdrop-brightness-70 flex justify-center gap-10">
            <a href='https://github.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faGithubAlt} size='xl' color='white' /></a>
            <a href='https://linkedin.com/in/aamirhatim' target='_blank'><FontAwesomeIcon icon={faLinkedinIn} size='xl' color='white' /></a>
            <a href='https://instagram.com/aamirhatim' target='_blank'><FontAwesomeIcon icon={faInstagram} size='xl' color='white' /></a>
            <a href='https://aamirhatim.wordpress.com' target='_blank'><FontAwesomeIcon icon={faPencil} size='xl' color='white' /></a>
        </div>
    )
}