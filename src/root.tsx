import "./root.css"
import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import HomePage from './components/pages/HomePage'
import AboutPage from './components/pages/AboutPage'
import ResumePage from './components/pages/ResumePage'
import ProjectsPage from './components/pages/ProjectsPage'
import Main from "./components/pages/Main"
import ProjectViewer from "./components/pages/ProjectViewer"

// Render the app
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
    const root = ReactDOM.createRoot(rootElement)
    root.render(
        <StrictMode>
            <BrowserRouter>
                <Routes>
                    <Route element={<Main />}> 
                        <Route index element={<HomePage />} />
                        <Route path="about" element={<AboutPage />} />
                        <Route path="resume" element={<ResumePage />} />
                        <Route path="projects">
                            <Route index element={<ProjectsPage />} />
                            <Route path=":projectId" element={<ProjectViewer />} />
                        </Route>
                    </Route>
                </Routes>
            </BrowserRouter>
        </StrictMode>
    )
}