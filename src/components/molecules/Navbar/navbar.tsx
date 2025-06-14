import { Link } from "@tanstack/react-router";

export default function Navbar() {
    const navItems = [
        'skills',
        'experience',
        'projects',
        'connect'
    ]
    return (
        <nav>
            {
                navItems.map( (n, idx) => (
                    <Link key={idx} to={n}>{n.toUpperCase()}</Link>
                ))
            }
        </nav>
    )
}