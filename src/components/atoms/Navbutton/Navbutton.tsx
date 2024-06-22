import './Navbutton.scss'

function nav_to_link() {
    console.log('Clicked a nav link')
}

function Navbutton( { label } : { label:string } ) {
    return (
        <div className='nav-button' onClick={nav_to_link}><p>{label}</p></div>
    )
}

export default Navbutton