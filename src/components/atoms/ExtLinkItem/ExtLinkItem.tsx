import './ExtLinkItem.style.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconDefinition } from '@fortawesome/fontawesome-svg-core'

export default function ExtLinkItem(props: {icon:IconDefinition, url:string, onMouseOver:()=>void, onMouseOut:()=>void}) {
    return (
        <div className='ext-link-item' onMouseOver={props.onMouseOver} onMouseOut={props.onMouseOut}>
            <a href={props.url} target='_blank'>
                <FontAwesomeIcon icon={props.icon} />
            </a>
        </div>
    )
}