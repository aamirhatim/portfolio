import './App.style.scss'

import Navbar from '../../organisms/Navbar/Navbar'
import Footer from '../../organisms/Footer/Footer'
import About from '../../organisms/About/About'
import Skills from '../../organisms/Skills/Skills'
import Projects from '../../organisms/Projects/Projects'

function App() {

  return (
    <>
      <Navbar />
      <About />
      <Skills />
      <Projects />
      <Footer />
    </>
  )
}

export default App
