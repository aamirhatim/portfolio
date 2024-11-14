import { faGithubAlt, faInstagram, faLinkedinIn } from '@fortawesome/free-brands-svg-icons'
import { faPencil } from '@fortawesome/free-solid-svg-icons'
import ExtLinkItem from '../../atoms/ExtLinkItem/ExtLinkItem'
import './Connect.style.scss'
import { useState } from 'react'

const githubTxt = "Check out my work on Github"
const linkedinTxt = "The best way to reach me is through LinkedIn"
const instaTxt = "I also love to take photos!"
const blogTxt = "For nostalgia - my blog when I lived in Turkey"

function Connect() {
    const [linkTxt, setLinkTxt] = useState<string>("")

    return (
        <div id='connect' className='content'>
            <div id='connect-links'>
                <ExtLinkItem 
                    icon={faGithubAlt} 
                    url='https://github.com/aamirhatim' 
                    onMouseOver={() => setLinkTxt(githubTxt)} 
                    onMouseOut={() => setLinkTxt("")}
                />
                <ExtLinkItem 
                    icon={faLinkedinIn} 
                    url='https://linkedin.com/in/aamirhatim' 
                    onMouseOver={() => setLinkTxt(linkedinTxt)} 
                    onMouseOut={() => setLinkTxt("")}
                />
                <ExtLinkItem 
                    icon={faInstagram} 
                    url='https://instagram.com/aamirhatim' 
                    onMouseOver={() => setLinkTxt(instaTxt)} 
                    onMouseOut={() => setLinkTxt("")}
                />
                <ExtLinkItem 
                    icon={faPencil} 
                    url='https://aamirhatim.wordpress.com/' 
                    onMouseOver={() => setLinkTxt(blogTxt)} 
                    onMouseOut={() => setLinkTxt("")}
                />
            </div>
            <div id='connect-txt'>{linkTxt}</div>
        </div>
    )
}

export default Connect