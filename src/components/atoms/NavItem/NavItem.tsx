import './NavItem.style.scss'

function NavItem(props: {title:string, icon:any, onClick:()=>void}) {
    return (
        <div key={props.title.toLowerCase()} id={'nav-item-' + props.title.toLowerCase()} className='nav-item' onClick={() => props.onClick()}>
            <div className='nav-icon'>{props.icon}</div>
            <div className='nav-title'>{props.title}</div>
        </div>
    )
}

export default NavItem