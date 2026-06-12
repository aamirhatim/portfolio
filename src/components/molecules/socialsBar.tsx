import GithubIcon from '../../assets/github.svg?react'
import InstagramIcon from '../../assets/instagram.svg?react'
import LinkedinIcon from '../../assets/linkedin.svg?react'
import WordpressIcon from '../../assets/wordpress.svg?react'
import useIsMobile from '../../lib/hooks/useIsMobile'
import { ANIMATION_DURATION_MS } from '../../data/constants';

export default function SocialsBar() {
    const isMobile = useIsMobile();

    // Omit color utilities to preserve the native brand colors of the SVGs
    // Apply scale and opacity for hover interactivity
    const brandIconClasses = isMobile
        ? ``
        : `transition-all duration-[${ANIMATION_DURATION_MS}ms] hover:scale-110 hover:opacity-80`

    return (
        <div className="flex justify-center gap-6 items-center">
            <a className={brandIconClasses} href='https://github.com/aamirhatim' target='_blank'><GithubIcon width={24} height={24} /></a>
            <a className={brandIconClasses} href='https://linkedin.com/in/aamirhatim' target='_blank'><LinkedinIcon width={24} height={24} /></a>
            <a className={brandIconClasses} href='https://instagram.com/aamirhatim' target='_blank'><InstagramIcon width={24} height={24} /></a>
            <a className={brandIconClasses} href='https://aamirhatim.wordpress.com' target='_blank'><WordpressIcon width={24} height={24} /></a>
        </div>
    )
}