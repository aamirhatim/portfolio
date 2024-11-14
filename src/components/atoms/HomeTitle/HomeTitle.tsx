import './HomeTitle.style.scss'
import Logo from '../../../assets/aamirhatim_logo.svg'

function HomeTitle(props: {onClick:()=>void}) {
    return (
        <div id='home-title' onClick={props.onClick}>
            <img id='logo' src={Logo} alt='logo' />
            aAMIR HUSaIN
        </div>
    )
}

export default HomeTitle