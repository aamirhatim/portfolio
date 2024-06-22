import './About.style.scss'
import Intro from '../../atoms/Intro/Intro'
import PersonPic from "../../../assets/person_transparent.png"
import Squiggle from "../../../assets/squiggle.svg"

function About() {
    return (
        <section id='about'>
            <img id="person-pic" src={PersonPic} />
            <div id='title'>Hi, I'm Aamir.</div>
            {/* <Intro /> */}
            <img className="separator" src={Squiggle} />
        </section>
    )
}

export default About