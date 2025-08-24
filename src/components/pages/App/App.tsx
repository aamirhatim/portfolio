import { RouterProvider, createRouter } from '@tanstack/react-router'
import { routeTree } from '../../../routeTree.gen'
import { useEffect, useState } from 'react'

// Create a new router instance
const router = createRouter({ routeTree, context: {} })

// Register the router instance for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}

export default function App() {
    // Get session storage
    const navSelection = sessionStorage.getItem('navSelection')

    // Create context variables
    const [nav, setNav] = useState<string>(navSelection ? navSelection : 'home')
    const [, setSidebarViz] = useState<boolean>(false)

    // Update sidebar based on nav selection
    useEffect( () => {
        // Set sidebar visibility
        if ( nav != 'home' ) {
            setSidebarViz(true)
        }

        // Update session storage
        sessionStorage.setItem('navSelection', nav)
    }, [nav])

    return (
        <RouterProvider router={router} context={{nav: nav, setNav: setNav}} />
    )
}