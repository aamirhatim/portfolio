import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCrown, faToolbox, faHammer, faPaperPlane, faHouse } from '@fortawesome/free-solid-svg-icons'
import './Nav.style.scss'
import NavItem from '../../atoms/NavItem/NavItem'

function Nav(props: {navSelect:string, setNav:React.Dispatch<React.SetStateAction<string>>}) {

    function updateNavIndicator() {
        let icon = null;

        switch (props.navSelect) {
            case 'skills':
                icon = faCrown
                break;
            case 'experience':
                icon = faToolbox
                break;
            case 'projects':
                icon = faHammer
                break;
            case 'connect':
                icon = faPaperPlane
                break;
        
            default:
                icon = faHouse
                break;
        }

        return <div id='nav-indicator'><FontAwesomeIcon icon={icon} /></div>
    }

    function updateNav(navName:string) {
        // Get currently selected item and unset the color
        const navCurrent:HTMLElement | null = document.querySelector('#nav-item-' + props.navSelect + ' .nav-icon')
        if (  navCurrent ) {
            navCurrent.style.color = 'unset';
        }

        // Get item to be selected and update color
        const navNew:HTMLElement | null = document.querySelector('#nav-item-' + navName + ' .nav-icon')
        if ( navNew ) {
            navNew.style.color = '#f0e351'
        }

        // Update nav
        props.setNav(navName)
    }

    return (
        <nav>
            {props.navSelect && updateNavIndicator()}
            
            <div id='nav-item-box'>
                <NavItem
                    title='SKILLS'
                    onClick={() => updateNav('skills')}
                    icon={<FontAwesomeIcon icon={faCrown} />}
                />

                <NavItem
                    title='EXPERIENCE'
                    onClick={() => updateNav('experience')}
                    icon={<FontAwesomeIcon icon={faToolbox} />}
                />

                <NavItem
                    title='PROJECTS'
                    onClick={() => updateNav('projects')}
                    icon={<FontAwesomeIcon icon={faHammer} />}
                />

                <NavItem
                    title='CONNECT'
                    onClick={() => updateNav('connect')}
                    icon={<FontAwesomeIcon icon={faPaperPlane} />}
                />
            </div>
        </nav>
    )
}

export default Nav