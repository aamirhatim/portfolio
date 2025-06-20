import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGithubAlt, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'

export default function SocialsBar() {
    return (
        <div className="fixed right-5 bottom-5 box-border px-8 py-4 rounded-full backdrop-blur-md backdrop-brightness-70 flex justify-center gap-10">
            <FontAwesomeIcon icon={faGithubAlt} size='xl' color='white' />
            <FontAwesomeIcon icon={faLinkedinIn} size='xl' color='white' />
            <FontAwesomeIcon icon={faInstagram} size='xl' color='white' />
            <FontAwesomeIcon icon={faPencil} size='xl' color='white' />
        </div>
    )
}