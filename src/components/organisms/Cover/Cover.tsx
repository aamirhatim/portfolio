import './Cover.style.scss'
import PersonPic from "../../../assets/person_transparent.png"

function Cover() {
    return (
        <section id='cover'>
            <div className='content'>
                <img id="person-pic" src={PersonPic} />
                <h1 id='title'>Hi, I'm Aamir.</h1>
            </div>
        </section>
    )
}

export default Cover