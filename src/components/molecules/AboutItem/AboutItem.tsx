import './AboutItem.style.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight } from '@fortawesome/free-solid-svg-icons'

function addArrows(num:number) {
    let a = [...Array(num)].map((_, i) => <FontAwesomeIcon key={i} icon={faAngleRight} />)

    return (
        <div className='arrows'>{a}</div>
    )
}

function AboutItem(props: {title:string, subtitle:string, description:string, level:number}) {
    return (
        <div className='about-item'>
            <div className='about-title'>{addArrows(props.level)}{props.title}</div>
            <div className='about-subtitle'>{props.subtitle}</div>
            <div className='about-description'>{props.description}</div>
        </div>
    )
}

export default AboutItem