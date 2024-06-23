import './Navbutton.scss'

function scrollToAnchor(anchor:string) {
    let e = document.getElementById(anchor)
    if (e) {
        e.scrollIntoView({behavior: "smooth"})
    }
}

function Navbutton( { label, anchor } : { label:string, anchor:string } ) {
    return (
        <div className='nav-button' onClick={() => {scrollToAnchor(anchor)}}><p>{label}</p></div>
    )
}

export default Navbutton