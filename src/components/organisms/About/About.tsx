import AboutItem from '../../molecules/AboutItem/AboutItem'
import './About.style.scss'

function About() {
    return (
        <div id='about' className='content'>
            <AboutItem
                title='My craft'
                subtitle='👨‍💻 🧠 👾'
                description='Software engineer with a focus in robotics'
                level={1}
            />

            <AboutItem
                title='My job'
                subtitle='💼 📚 🚗'
                description='R&D @Verizon for 5G + edge computing for IoT devices and autonomous machines'
                level={2}
            />

            <AboutItem
                title='My purpose'
                subtitle='🤖 🫶 🌎'
                description='Ethical enablement of automation and robotics in verticals that need it most'
                level={3}
            />
        </div>
    )
}

export default About